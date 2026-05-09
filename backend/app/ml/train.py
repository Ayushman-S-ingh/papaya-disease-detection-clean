"""
ml/training/train.py
EfficientNetB0 Transfer Learning training pipeline for Papaya Disease Detection

Usage:
    python train.py --dataset_path ../data/papaya_dataset --epochs 50

Dataset structure expected:
    papaya_dataset/
    ├── train/
    │   ├── Healthy_Leaf/          (images...)
    │   ├── Papaya_Ring_Spot_Virus/ (images...)
    │   └── ... (one folder per class)
    ├── val/
    └── test/
"""
import os
import argparse
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow.keras import layers, models, optimizers, callbacks
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.applications.efficientnet import preprocess_input
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# ── Configuration ──────────────────────────────────────────────────────────────
IMG_SIZE     = (224, 224)
BATCH_SIZE   = 32
NUM_CLASSES  = 12
SEED         = 42
OUTPUT_PATH  = "models/efficientnetb0_papaya.h5"

# ── Augmentation ───────────────────────────────────────────────────────────────
def build_generators(dataset_path: str):
    """Build training (augmented) and validation data generators."""

    train_gen = ImageDataGenerator(
        preprocessing_function = preprocess_input,
        rotation_range         = 30,
        width_shift_range      = 0.2,
        height_shift_range     = 0.2,
        shear_range            = 0.15,
        zoom_range             = 0.2,
        horizontal_flip        = True,
        vertical_flip          = False,
        brightness_range       = [0.7, 1.3],
        fill_mode              = "nearest",
    )
    val_gen = ImageDataGenerator(preprocessing_function=preprocess_input)

    train_ds = train_gen.flow_from_directory(
        os.path.join(dataset_path, "train"),
        target_size = IMG_SIZE,
        batch_size  = BATCH_SIZE,
        class_mode  = "categorical",
        shuffle     = True,
        seed        = SEED,
    )
    val_ds = val_gen.flow_from_directory(
        os.path.join(dataset_path, "val"),
        target_size = IMG_SIZE,
        batch_size  = BATCH_SIZE,
        class_mode  = "categorical",
        shuffle     = False,
    )
    return train_ds, val_ds


# ── Model architecture ─────────────────────────────────────────────────────────
def build_model(num_classes: int = NUM_CLASSES, freeze_base: bool = True) -> tf.keras.Model:
    """
    EfficientNetB0 base + custom classification head.

    Phase 1: Train only the head (freeze base).
    Phase 2: Unfreeze top layers of base for fine-tuning.
    """
    base_model = EfficientNetB0(
        include_top  = False,
        weights      = "imagenet",
        input_shape  = (*IMG_SIZE, 3),
    )
    base_model.trainable = not freeze_base

    inputs  = tf.keras.Input(shape=(*IMG_SIZE, 3), name="input_image")
    x       = base_model(inputs, training=not freeze_base)
    x       = layers.GlobalAveragePooling2D(name="gap")(x)
    x       = layers.BatchNormalization()(x)
    x       = layers.Dense(256, activation="relu", name="dense_256")(x)
    x       = layers.Dropout(0.40, name="dropout_04")(x)
    outputs = layers.Dense(num_classes, activation="softmax", name="predictions")(x)

    model = models.Model(inputs=inputs, outputs=outputs, name="EfficientNetB0_Papaya")
    return model, base_model


# ── Training ───────────────────────────────────────────────────────────────────
def train(dataset_path: str, epochs: int = 50, fine_tune_epochs: int = 20):
    os.makedirs("models", exist_ok=True)

    train_ds, val_ds = build_generators(dataset_path)
    num_classes = train_ds.num_classes
    print(f"\n✅ Classes detected ({num_classes}): {list(train_ds.class_indices.keys())}\n")

    # ── Phase 1: Train head only ───────────────────────────────────────────
    print("=" * 60)
    print("PHASE 1: Training classification head (base frozen)")
    print("=" * 60)

    model, base_model = build_model(num_classes=num_classes, freeze_base=True)
    model.compile(
        optimizer = optimizers.Adam(learning_rate=1e-3),
        loss      = "categorical_crossentropy",
        metrics   = ["accuracy", tf.keras.metrics.AUC(name="auc")],
    )
    model.summary()

    cbs_phase1 = [
        callbacks.ModelCheckpoint(
            "models/phase1_best.h5",
            monitor="val_accuracy", save_best_only=True, verbose=1
        ),
        callbacks.EarlyStopping(monitor="val_accuracy", patience=8, restore_best_weights=True),
        callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=4, min_lr=1e-6),
        callbacks.TensorBoard(log_dir="logs/phase1"),
    ]

    hist1 = model.fit(
        train_ds,
        validation_data = val_ds,
        epochs          = epochs,
        callbacks       = cbs_phase1,
        verbose         = 1,
    )

    # ── Phase 2: Fine-tune top layers ─────────────────────────────────────
    print("\n" + "=" * 60)
    print("PHASE 2: Fine-tuning top 30 layers of EfficientNetB0")
    print("=" * 60)

    # Unfreeze top 30 layers
    base_model.trainable = True
    for layer in base_model.layers[:-30]:
        layer.trainable = False

    model.compile(
        optimizer = optimizers.Adam(learning_rate=1e-5),   # lower LR for fine-tuning
        loss      = "categorical_crossentropy",
        metrics   = ["accuracy", tf.keras.metrics.AUC(name="auc")],
    )

    cbs_phase2 = [
        callbacks.ModelCheckpoint(
            OUTPUT_PATH,
            monitor="val_accuracy", save_best_only=True, verbose=1
        ),
        callbacks.EarlyStopping(monitor="val_accuracy", patience=10, restore_best_weights=True),
        callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.3, patience=5, min_lr=1e-8),
        callbacks.TensorBoard(log_dir="logs/phase2"),
    ]

    hist2 = model.fit(
        train_ds,
        validation_data = val_ds,
        epochs          = fine_tune_epochs,
        callbacks       = cbs_phase2,
        verbose         = 1,
    )

    print(f"\n✅ Best model saved to: {OUTPUT_PATH}")
    _plot_history(hist1, hist2)
    return model


def _plot_history(hist1, hist2):
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    epochs1 = len(hist1.history["accuracy"])
    epochs2 = len(hist2.history["accuracy"])
    total   = epochs1 + epochs2

    acc  = hist1.history["accuracy"]  + hist2.history["accuracy"]
    vacc = hist1.history["val_accuracy"] + hist2.history["val_accuracy"]
    loss = hist1.history["loss"]   + hist2.history["loss"]
    vloss= hist1.history["val_loss"]  + hist2.history["val_loss"]

    axes[0].plot(acc,  label="Train Acc"); axes[0].plot(vacc, label="Val Acc")
    axes[0].axvline(epochs1, ls="--", color="gray", label="Fine-tune start")
    axes[0].set(title="Accuracy", xlabel="Epoch"); axes[0].legend()

    axes[1].plot(loss, label="Train Loss"); axes[1].plot(vloss, label="Val Loss")
    axes[1].axvline(epochs1, ls="--", color="gray")
    axes[1].set(title="Loss", xlabel="Epoch"); axes[1].legend()

    plt.tight_layout()
    plt.savefig("models/training_curves.png", dpi=120)
    print("📊 Training curves saved to models/training_curves.png")


# ── Entry point ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train EfficientNetB0 for Papaya Disease Detection")
    parser.add_argument("--dataset_path",    default="../data/papaya_dataset", type=str)
    parser.add_argument("--epochs",          default=50,  type=int, help="Phase 1 epochs")
    parser.add_argument("--fine_tune_epochs",default=20,  type=int, help="Phase 2 fine-tuning epochs")
    args = parser.parse_args()

    print(f"""
╔══════════════════════════════════════════════════════╗
║   AI Papaya Leaf Disease Detection — Training        ║
║   Base model: EfficientNetB0 (ImageNet pretrained)   ║
║   Framework:  TensorFlow 2.x / Keras                 ║
╚══════════════════════════════════════════════════════╝
    """)
    model = train(args.dataset_path, args.epochs, args.fine_tune_epochs)
    print("\n🌿 Training complete!")