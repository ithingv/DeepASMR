import os
from pytube import YouTube

class YoutubeDownloader():
    def __init__(self, folder='./mp4_folder'):
        if os.path.exists(folder):
            self.folder = folder
        else:
            os.mkdir(folder)
            self.folder = folder

    def down_files(self, urls):
        if type(urls) == list and len(urls):
            for idx, url in enumerate(urls):
                try:
                    yt = YouTube(url) #yt 인스턴스 생성
                except VideoUnavailable:
                    print(f'{idx + 1}번째 {url}는 사용할 수 없습니다.') # url 에러
                else:
                    audio = yt.streams.filter(only_audio=True).first() # 
                    print(f'파일명: {yt.title}\n') 
                    print(f'다운로드 시작')
                    try:
                        print("원하는 파일명.mp4를 입력하세요 예시: music.mp4")
                        filename = input()
                        print("다운로드 중 입니다.............................")
                        audio.download(output_path=self.folder, filename=filename)
                        print(f'다운로드 완료 {(idx + 1)} / {len(urls)}')
                        print("-" * 100)
                    except Exception:
                        print(f"다운로드 중 오류가 발생하였습니다.")
                        continue
            print("파일 다운로드 종료")
            return
        
        else:
            print('URL을 올바르게 입력해주세요')
            return

if __name__ == "__main__":
    urls = ['https://www.youtube.com/watch?v=xhOL03fe0Tw&t=987s']
    yt = YoutubeDownloader()
    yt.down_files(urls)