import os
from pydub import AudioSegment
from pydub.utils import make_chunks

BASE_DIR = './'
MP4_SOURCE = BASE_DIR + 'mp4_folder/'
WAV_SOURCE = BASE_DIR + 'wav_folder/'

class AudioHandler():
    def __init__(self, filepath):
        self.file_path = filepath # 오디오 파일 전체 경로
        self.file_name = os.path.splitext(self.file_path)[0] # 파일경로
        self.file_format = os.path.splitext(self.file_path)[1] # 확장자
        self.__audio = AudioSegment.from_file(self.file_path) # 오디오 파일 로드
    
    def get_duration(self):
        """ 원본 오디오 파일의 재생시간"""
        return self.__audio.duration_seconds
    
    def file_split(self, start_min, start_sec, end_min, end_sec, fname):
        """ 원본 오디오 파일에서 원하는 구간 Split 해서 wav 파일로 저장"""
        t1 = start_min * 60 * 1000 + start_sec * 1000
        t2 = end_min * 60 * 1000 + end_sec * 1000
        split_audio = self.__audio[t1:t2]
        save_path = os.path.join(WAV_SOURCE, fname)
        split_audio.export(save_path + '.wav', format='wav')
            
    def convert_to_wav(self):
        """mp4 파일을 wav로 포맷변경"""
        try:
            filename = os.path.basename(self.file_name)
            save_path = os.path.join(WAV_SOURCE, filename)
            self.__audio.export(save_path + ".wav", format="wav")
        except:
            print("파일변환에러")

    def chunk_wav_data(self, chunk_length):
        """chunk_length 단위로 원본 오디오 파일을 temp 폴더에 저장"""
        folder_path = os.path.join(BASE_DIR, 'temp')
        if os.path.exists(BASE_DIR + 'temp'): # temp 폴더가 이미 존재한다면 폴더 삭제
            os.system("rm -rf {}".format(folder_path))

        os.mkdir(folder_path) # temp 폴더 생성
        chunk_length_ms = 1000 * chunk_length # pydub calculates in millisec
        chunks = make_chunks(self.__audio, chunk_length_ms) #Make chunks of one sec      

        for i, chunk in enumerate(chunks):
            chunk_name = "{}.wav".format(i)
            print("exporting ", chunk_name)
            chunk.export(os.path.join(folder_path, chunk_name), format="wav")

if __name__ == "__main__":

    # AudioHandler 객체 생성
    audio = AudioHandler(MP4_SOURCE + 'rain.mp4')
    audio.convert_to_wav()
    audio.chunk_wav_data(10) # 10초 단위로 파일 chunk