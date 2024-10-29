- Cách copy 2 nhánh bất kỳ từ repo 1 sang 2 nhánh bất kỳ repo 2: bằng gitKraKen
```bash
git clone https://github.com/username/source-repo.git
cd source-repo

git remote add destination https://github.com/Hngdcmnh/content-the-coach

# push the current branch origin/deploy to the destination branch main of the destination repo
git push destination origin/deploy:main

# ghi đè lên nhánh main của repo đích
git push --force destination origin/deploy:main

git fetch destination
git branch -r

git log destination/doanngoccuong_BackEnd_
```


Đúng rồi, lệnh này:

```bash
git push destination origin/deploy:main
```
sẽ đẩy nhánh origin/deploy của repo hiện tại (repo nguồn) lên nhánh main của repo đích (được định nghĩa là destination). Về cơ bản, lệnh này sẽ chuyển các thay đổi từ nhánh origin/deploy trong repo của bạn lên nhánh main trên repo đích mà bạn đã thêm vào bằng lệnh git remote add destination.

Nếu nhánh main trên repo đích có bất kỳ thay đổi nào chưa có trong nhánh origin/deploy của bạn, bạn sẽ cần kéo các thay đổi đó về trước khi đẩy để tránh lỗi xung đột.

- Cần hiểu chút origin là gì, main là gì? , master là gì?
    - **`origin`**: Tên mặc định cho remote repository mà bạn clone từ nó, thường là URL của repository từ xa.
        - Các lệnh làm việc với `origin`:
            - `git fetch origin`: Lấy các cập nhật từ remote repository `origin`.
            - `git push origin main`: Push các thay đổi từ local branch `main` lên remote `origin`.
    - **`main`**: Tên nhánh mặc định trong nhiều repo hiện nay, thường lưu trữ phiên bản code chính.
    - **`master`**: Tên nhánh mặc định trước đây, được thay thế bằng `main` trong các phiên bản Git hiện đại, nhưng có thể vẫn được sử dụng trong các dự án cũ.
