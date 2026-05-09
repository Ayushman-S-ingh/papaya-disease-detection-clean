import os
import tensorflow as tf
import matplotlib.pyplot as plt

from tensorflow.keras import layers
from tensorflow.keras import models
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.callbacks import (
    EarlyStopping,
    ModelCheckpoint,
    ReduceLROnPlateau
)

# =====================================================
# CHECK GPU / APPLE METAL
# =====================================================

print("TensorFlow Version:", tf.__version__)

print("GPU Available:", tf.config.list_physical_devices('GPU'))

# =====================================================
# SETTINGS
# =====================================================

DATASET_PATH = "dataset"

IMG_SIZE = (160, 160)

BATCH_SIZE = 16

EPOCHS = 5

# =====================================================
# LOAD DATASET
# =====================================================

train_dataset = tf.keras.utils.image_dataset_from_directory(

    DATASET_PATH,

    validation_split=0.2,

    subset="training",

    seed=42,

    image_size=IMG_SIZE,

    batch_size=BATCH_SIZE

)

validation_dataset = tf.keras.utils.image_dataset_from_directory(

    DATASET_PATH,

    validation_split=0.2,

    subset="validation",

    seed=42,

    image_size=IMG_SIZE,

    batch_size=BATCH_SIZE

)

# =====================================================
# CLASS NAMES
# =====================================================

class_names = train_dataset.class_names

print("Classes:", class_names)

# =====================================================
# PERFORMANCE OPTIMIZATION
# =====================================================

AUTOTUNE = tf.data.AUTOTUNE

train_dataset = train_dataset.cache().prefetch(
    buffer_size=AUTOTUNE
)

validation_dataset = validation_dataset.cache().prefetch(
    buffer_size=AUTOTUNE
)

# =====================================================
# DATA AUGMENTATION
# =====================================================

data_augmentation = models.Sequential([

    layers.RandomFlip("horizontal"),

    layers.RandomRotation(0.2),

    layers.RandomZoom(0.2),

])

# =====================================================
# BASE MODEL
# =====================================================

base_model = EfficientNetB0(

    include_top=False,

    weights="imagenet",

    input_shape=(160, 160, 3)

)

# Freeze pretrained layers
base_model.trainable = False

# =====================================================
# BUILD MODEL
# =====================================================

inputs = tf.keras.Input(shape=(160, 160, 3))

x = data_augmentation(inputs)

x = tf.keras.applications.efficientnet.preprocess_input(x)

x = base_model(x, training=False)

x = layers.GlobalAveragePooling2D()(x)

x = layers.Dropout(0.3)(x)

outputs = layers.Dense(

    len(class_names),

    activation="softmax"

)(x)

model = tf.keras.Model(inputs, outputs)

# =====================================================
# COMPILE MODEL
# =====================================================

model.compile(

    optimizer="adam",

    loss="sparse_categorical_crossentropy",

    metrics=["accuracy"]

)

# =====================================================
# MODEL SUMMARY
# =====================================================

model.summary()

# =====================================================
# CALLBACKS
# =====================================================

callbacks = [

    EarlyStopping(

        monitor="val_loss",

        patience=3,

        restore_best_weights=True

    ),

    ReduceLROnPlateau(

        monitor="val_loss",

        factor=0.2,

        patience=2,

        verbose=1

    ),

    ModelCheckpoint(

        "papaya_model.keras",

        monitor="val_accuracy",

        save_best_only=True,

        verbose=1

    )

]

# =====================================================
# TRAIN MODEL
# =====================================================

history = model.fit(

    train_dataset,

    validation_data=validation_dataset,

    epochs=EPOCHS,

    callbacks=callbacks

)

# =====================================================
# SAVE FINAL MODEL
# =====================================================

model.save("papaya_model.keras")

print("\nModel saved successfully!")

# =====================================================
# PLOT ACCURACY
# =====================================================

plt.figure(figsize=(10, 5))

plt.plot(history.history["accuracy"])

plt.plot(history.history["val_accuracy"])

plt.title("Model Accuracy")

plt.xlabel("Epoch")

plt.ylabel("Accuracy")

plt.legend(["Train", "Validation"])

plt.show()

# =====================================================
# PLOT LOSS
# =====================================================

plt.figure(figsize=(10, 5))

plt.plot(history.history["loss"])

plt.plot(history.history["val_loss"])

plt.title("Model Loss")

plt.xlabel("Epoch")

plt.ylabel("Loss")

plt.legend(["Train", "Validation"])

plt.show()