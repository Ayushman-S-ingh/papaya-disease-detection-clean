import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import BatchNormalization, Dense


# =====================================================
# CUSTOM DENSE
# =====================================================
class CustomDense(Dense):

    def __init__(self, *args, **kwargs):

        kwargs.pop("quantization_config", None)

        super().__init__(*args, **kwargs)


# =====================================================
# CUSTOM BN
# =====================================================
class CustomBatchNormalization(BatchNormalization):

    def __init__(self, *args, **kwargs):

        kwargs.pop("renorm", None)
        kwargs.pop("renorm_clipping", None)
        kwargs.pop("renorm_momentum", None)
        kwargs.pop("synchronized", None)

        super().__init__(*args, **kwargs)


# =====================================================
# LOAD OLD MODEL
# =====================================================
old_model = load_model(
    "app/ml/papaya_model.h5",
    custom_objects={
        "Dense": CustomDense,
        "BatchNormalization": CustomBatchNormalization,
        "CustomBatchNormalization": CustomBatchNormalization,
    },
    compile=False
)


# =====================================================
# REBUILD CLEAN MODEL
# =====================================================
clean_model = tf.keras.models.clone_model(old_model)

clean_model.set_weights(old_model.get_weights())


# =====================================================
# SAVE CLEAN MODEL
# =====================================================
clean_model.save(
    "app/ml/papaya_model.keras",
    save_format="keras"
)

print("✅ CLEAN MODEL SAVED")