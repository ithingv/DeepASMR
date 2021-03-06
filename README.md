# DeepASMR GAN ๐ด
**Aiffel Mini-Hackerton <10.13 ~ 10.15>**
<img style="margin-top: 20px" src='./images/img1.PNG'> </img>
<img src='./images/img17.PNG'> </img>

## ํ๋ก์ ํธ ์์ฝ 
[ํ๋ก์ ํธ ํ์ด์ง](https://deep-asmr.github.io/DeepASMR_presentation)

### *completed*

- [๋ฐ์ดํฐ ์ ์](#data-definition)
- [๋ฐ์ดํฐ ์์ง](#data-collection)
- [๋ฐ์ดํฐ ์ ์ฒ๋ฆฌ](#data-preprocessing)
- [์์ฑ ๋ชจ๋ธ ๊ตฌ์ถ](#generative-model)
- [์์ ์์ฑ ๋ฐ ๊ฒฐ๊ณผ](#result)
- [๊ณต๊ณต ๋น๋ฐ์ดํฐ ๊ณต๋ชจ์  PPT ์ ์ถ](#competition) 
---
### *In-progress*

- ์ฅ๋ฅด ๋ถ๋ฅ ๋ชจ๋ธ ๊ตฌ์ถ
-  ์ฅ๋ฅด ๋ถ๋ฅ ๊ฒฐ๊ณผ ์๊ฐํ(ํด๋ฌ์คํฐ๋ง)
-  ์น ์ดํ๋ฆฌ์ผ์ด์ ์ ์
-  ๋ฐ์ดํฐ๋ฒ ์ด์ค ๊ตฌ์ถ
-  MIDI ๋ฐ์ดํฐ ํ๋ณด ๋ฐ ์์ ์์ฑ
-  ์ค๋์ค ๊ฒฐํฉ ๋ฐ ํฉ์ฑ(Audio Concatenation & Synthesis)
---

 ## [Data Definition]()

<img style="margin-top: 20px" src='./images/img2.PNG'> </img>


### `ASMR Attributes`
```
1. id - asmrID
2. author - ์์ ์ ์์๋ช
3. title - ์ ์ฅํ  ํ์ผ๋ช
4. channel_url - ์์ URL
5. publish_date - ์์ ์๋ก๋์ผ
6. genre -  {nature, mix, tap}์ผ๋ก ๊ตฌ๋ถ 
7. comment - ๋ง์๋ฆฌ ํฌํจ ์ ๋ฌด {ํฌํจ:1, ๋ฏธํฌํจ: 0}
8. file_size - ํ์ผ ํฌ๊ธฐ
9. genre_keyword - ์ฅ๋ฅด์ ๋ํ ์ถ๊ฐ์ ์ธ ์ ๋ณด
10. description - ์์ ์ค๋ช
```

### `Youtube`
```
ex)
URL: GET,
/api/asmr/{asmrId}/youtube/

{
    data : {
        "id": 1,
        "author": "์นด๋ฏผCarmine",
        "title": "yt_nature_fire_20180619",
        "channel_url": "https://www.youtube.com/watch?v=2TrgSww4Wf8&t=8s",
        "publish_date": "20180619",
        "genre": "nature",
        "comment": "0",
        "file_size": "2147483",
        "genre_keyword": "fire",
        "description": "๐ฅ ๊ณต๋ถํ  ๋ ๋ฃ๋ ์ฅ์ ํ๋ ์๋ฆฌ / Fireplace sound"
    }
}
```
---

### `Public Data`

```
ex)
URL: GET,
/api/asmr/{asmrId}/public/

{
    data : {
        "id": 2,
        "author": "๊ตญ๋ฆฝ๊ณต์๊ณต๋จ",
        "title": "pb_nature_snow_20191231"
        "channel_url": "http://s3-asia-east.amazonaws.com/asmr/1",
        "publish_date": "20191231",
        "genre": "nature",
        "comment": "0",
        "file_size": "100000",
        "genre_keyword": "snow",
        "description": "์์ฐ์น์ ๋์์_๋์ ์ฐ๋ฑ์ฐ๋ก๋๋ฐ๋์๋ฆฌ"
    }
}
```
---
## [Data Collection]()
<img style="margin-top: 20px" src='./images/img3.PNG'> </img>

*๋ฐ์ดํฐ ํฌ๋กค๋ง*
- Youtube ๋ฐ์ดํฐ๋ฅผ ์์งํ๊ธฐ ์ํด `pytube` ๋ผ์ด๋ธ๋ฌ๋ฆฌ๋ฅผ ์ฌ์ฉํ์ฌ ์ํ๋ ์์์ url์ ๋ฐ์ `mp4` ํ์ผ์ ๋ค์ด๋ฐ์ ์ ์๊ฒ ๊ธฐ๋ฅ์ ๊ตฌํ
- ์ค๋์ค ๋ฐ์ดํฐ ์ ์ฒ๋ฆฌ๋ฅผ ์ํด `pydub`์ `ffmpeg` ๋ผ์ด๋ธ๋ฌ๋ฆฌ๋ฅผ ์ฌ์ฉ
- ๊ณ ์์ง๋ก์ ๋ณํ์ ์ํด `mp4` ํฌ๋งท์์ `wav` ํฌ๋งท์ผ๋ก ๋ณ๊ฒฝ
- [๊ณต๊ณต๋ฐ์ดํฐ ํฌํธ](https://www.data.go.kr/)์ ASMR ๋ฐ์ดํฐ ์ด 94๊ฐ ํ๋ณด (์๋ถ๋ถ ์ธํธ๋ก 5์ด ์ ๊ฑฐ ์๋ฃ)  
<img style="margin-top: 20px" src='./images/img9.PNG'> </img>

---
## [Data Preprocessing]()
<img style="margin-top: 20px" src='./images/img4.PNG'> </img>

*์ฐธ๊ณ  ๋ธํธ๋ถ*

- [1. Audio Processing](https://github.com/ithingv/ai_study/blob/main/Deep_Learning/Speech/Audio_Processing.ipynb)
- [2. Audio Classification](https://github.com/ithingv/ai_study/blob/main/Deep_Learning/Speech/Audio_Classification.ipynb)
- [3. Speech Synthesis](https://github.com/ithingv/ai_study/blob/main/Deep_Learning/Speech/Speech%20Synthesis.ipynb)


*๋ฐ์ดํฐ ์ ์ฒ๋ฆฌ ํ๋ก์ธ์ค*
```
# ์ด๋ฒ ๋ฏธ๋ ํด์ปคํค ํ๋ก์ ํธ์์๋ 1์ฐจ์ sequence ๋ฐ์ดํฐ๋ฅผ ํ์ฉํ์ฌ ์์์ ์์ฑํ์์
1. mp4 -> wav
2. duration = 30์ด ๋จ์๋ก ๋ฐ์ดํฐ chunk
3. sampling rate = 22500๋ก ์ค์ 
4. Input: 1D Sequence (dtype=numpy.float32)

# 2D ๋ฉ์คํํธ๋ก๊ทธ๋จ ๋ณํ์
1. mp4 -> wav
2. duration = 30์ด ๋จ์๋ก ๋ฐ์ดํฐ chunk 
3. Sampling, Normalization, Mu-Law Encoding
4. Fast Fourier Transform 
5. Input: Melspectrogram(2D)
```
---
## [Generative Model]()


### Model List
<img  src='./images/img10.PNG'> </img>

---

### ํ๋ก์ ํธ์ ์ฌ์ฉํ ์ต์ข ๋ชจ๋ธ ---> `Resnet + VAE`
<img style="margin-top: 20px" src='./images/img5.PNG'> </img>
<img  src='./images/img6.PNG'> </img>


# `Resnet`
<img style="margin-top: 20px" src='./images/img14.PNG'> </img>

```
class Resnet1DBlock(tf.keras.Model):
    def __init__(self, kernel_size, filters,type='encode'):
        super(Resnet1DBlock, self).__init__(name='')
    
        if type=='encode':
            self.conv1a = layers.Conv1D(filters, kernel_size, 2,padding="same")
            self.conv1b = layers.Conv1D(filters, kernel_size, 1,padding="same")
            self.norm1a = tfa.layers.InstanceNormalization()
            self.norm1b = tfa.layers.InstanceNormalization()
        if type=='decode':
            self.conv1a = layers.Conv1DTranspose(filters, kernel_size, 1,padding="same")
            self.conv1b = layers.Conv1DTranspose(filters, kernel_size, 1,padding="same")
            self.norm1a = tf.keras.layers.BatchNormalization()
            self.norm1b = tf.keras.layers.BatchNormalization()
        else:
            return None

    def call(self, input_tensor):
        x = tf.nn.relu(input_tensor)
        x = self.conv1a(x)
        x = self.norm1a(x)
        x = layers.LeakyReLU(0.4)(x)

        x = self.conv1b(x)
        x = self.norm1b(x)
        x = layers.LeakyReLU(0.4)(x)

        x += input_tensor
        return tf.nn.relu(x)
```

---
# `VAE`

<img style="margin-top: 20px" src='./images/img12.PNG'> </img>
<img style="margin-top: 20px" src='./images/img13.PNG'> </img>

```
class CVAE(tf.keras.Model):

    def __init__(self, latent_dim):
        super(CVAE, self).__init__()
        self.latent_dim = latent_dim
        self.encoder = tf.keras.Sequential(
            [
                tf.keras.layers.InputLayer(input_shape=(1,22500*30)),# 90001
                layers.Conv1D(64,1,2),
                Resnet1DBlock(64,1),
                layers.Conv1D(128,1,2),
                Resnet1DBlock(128,1),
                layers.Conv1D(128,1,2),
                Resnet1DBlock(128,1),
                layers.Conv1D(256,1,2),
                Resnet1DBlock(256,1),
                # No activation
                layers.Flatten(),
                layers.Dense(latent_dim+latent_dim)

            ]
        )
        self.decoder = tf.keras.Sequential(
            [
                tf.keras.layers.InputLayer(input_shape=(latent_dim,)),
                layers.Reshape(target_shape=(1,latent_dim)),
                Resnet1DBlock(512,1,'decode'),
                layers.Conv1DTranspose(512,1,1),
                Resnet1DBlock(256,1,'decode'),
                layers.Conv1DTranspose(256,1,1),
                Resnet1DBlock(128,1,'decode'),
                layers.Conv1DTranspose(128,1,1),
                Resnet1DBlock(64,1,'decode'),
                layers.Conv1DTranspose(64,1,1),
                # No activation
                layers.Conv1DTranspose(22500*30,1,1), #90001
            ]
        )

    @tf.function
    def sample(self, eps=None):
        if eps is None:
            eps = tf.random.normal(shape=(200, self.latent_dim))
        return self.decode(eps, apply_sigmoid=True)

    @tf.function
    def encode(self, x):
        mean, logvar = tf.split(self.encoder(x), num_or_size_splits=2, axis=1)
        return mean, logvar

    @tf.function
    def reparameterize(self, mean, logvar):
        eps = tf.random.normal(shape=mean.shape)
        return eps * tf.exp(logvar * .5) + mean

    @tf.function
    def decode(self, z, apply_sigmoid=False):
        logits = self.decoder(z)
        if apply_sigmoid:
            probs = tf.sigmoid(logits)
            return probs
        return logits

    @tf.function
    def log_normal_pdf(sample, mean, logvar, raxis=1):
        log2pi = tf.math.log(2. * np.pi)
        return tf.reduce_sum(
             -.5 * ((sample - mean) ** 2. * tf.exp(-logvar) + logvar + log2pi),axis=raxis)

    @tf.function
    def compute_loss(model, x):
        mean, logvar = model.encode(x)
        z = model.reparameterize(mean, logvar)
        x_logit = model.decode(z)
        cross_ent = tf.nn.sigmoid_cross_entropy_with_logits(logits=x_logit, labels=x)
        logpx_z = -tf.reduce_sum(cross_ent, axis=[1,2])
        logpz = log_normal_pdf(z, 0., 0.)
        logqz_x = log_normal_pdf(z, mean, logvar)
        return -tf.reduce_mean(logpx_z + logpz - logqz_x)
```
---
## [Result]()
<img style="margin-top: 20px" src='./images/img7.PNG'> </img>

DeepASMR Demo url: https://deep-asmr.github.io/DeepASMR_web/

---
## [Competition](#competition)
<img style="margin-top: 20px" src='./images/img16.PNG'> </img>
<img src='./images/img15.PNG'> </img>

- ํํ์ด์ง : https://www.data.go.kr/bbs/ntc/selectNotice.do?pageIndex=1&originId=NOTICE_0000000002205&atchFileId=
- 2021๋ ๊ณต๊ณต๋น๋ฐ์ดํฐ ๋ถ์ ๊ณต๋ชจ์  ๊ณต๋ชจ(~10.15) ์ง์์ ์ ์ ์๋ฃ
- [์ต์ข ์ ์ถ ์ง์์ pdf](./docs/ASMR.pdf)





