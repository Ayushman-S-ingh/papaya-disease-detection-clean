"""
Image preprocessing for prediction
"""

import numpy as np
from tensorflow.keras.preprocessing import image


def preprocess_image(img_path, target_size=(224, 224)):

    img = image.load_img(
        img_path,
        target_size=target_size
    )

    img_array = image.img_to_array(img)

    img_array = img_array / 255.0

    img_array = np.expand_dims(img_array, axis=0)

    return img_array