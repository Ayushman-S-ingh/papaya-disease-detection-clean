import os
import tensorflow as tf

model = None


def get_model():
    global model

    if model is None:

        model_path = os.path.join(
            os.path.dirname(__file__),
            "papaya_model.keras"
        )

        model = tf.keras.models.load_model(model_path)

    return model