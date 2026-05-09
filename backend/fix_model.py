import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import BatchNormalization

# -----------------------------
# Patch BatchNormalization
# -----------------------------
class CustomBatchNormalization(BatchNormalization):
    def __init__(self, *args, **kwargs):

        kwargs.pop("renorm", None)
        kwargs.pop("renorm_clipping", None)
        kwargs.pop("renorm_momentum", None)
        kwargs.pop("synchronized", None)

        super().__init__(*args, **kwargs)

# -----------------------------
# Load old model safely
# -----------------------------
model = load_model(
    "app/ml/papaya_model.h5",
    custom_objects={
        "BatchNormalization": CustomBatchNormalization
    },
    compile=False
)

# -----------------------------
# Save fixed model
# -----------------------------
model.save("app/ml/papaya_model_fixed.h5")

print("✅ Model fixed successfully!")