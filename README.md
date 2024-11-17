# SoftwareProjectManagement
Tập làm quen việc quản lý 1 dự án công nghệ thông tin theo quy trình Scrum

Đề tài: Xây dựng 1 hệ thống quản lý đơn xin cấp tài sản

Mô tả bài toán: Công ty A có 1000 nhân sự. Các nhân sự được chia thành các bộ phận và được quản lý bởi các trưởng bộ phận đó. Khi cần 1 tài sản nào đó như laptop, điện thoại cho công việc thì hiện tại công ty vẫn đang quản lý bằng giấy tờ. Điều này gây khó khăn khi giấy tờ có thể mất và tìm kiếm khá khó khăn. Công ty cần xây dựng 1 hệ thống để quản lý việc cấp phát tài sản đó

Quy trình nghiệp vụ:

-Khi có yêu cầu nhân viên sẽ tạo và gửi đơn Yêu cầu cung cấp thiết bị (có nhiều loại tài sản khác nhau được sử dụng mới mục đích khác nhau ví dụ Laptop, Desktop, Monitor, Mobile…)

-Nhân viên có thể sửa đơn, xóa đơn miễn là trước khi trưởng bộ phận duyệt. Sau khi được duyệt thì đơn sẽ không thể xóa nữa

-Sau khi nộp đơn thì Trưởng bộ phận của nhân viên sẽ tiến hành phê duyệt. Trưởng bộ phận có thể phê duyệt toàn bộ hoặc phê duyệt một phần. Trường hợp từ chối sẽ cần tạo đơn mới.

-Sau khi yêu cầu được phê duyệt thì Bộ phận quản lý tài sản sẽ chuẩn bị thiết bị tương ứng, duyệt đơn, gửi thông báo cho nhân viên xuống nhận và tiến hành bàn giao.

-Sau khi bản giao xong thì Nhân viên phải có trách nhiệm quản lý các tài sản mình đang nắm giữ.


*Lưu ý khi chạy backend:
- Sau khi tải file về, chỉnh sửa đường dẫn database thành của mình trong file appsetting.json 
- Xóa folder Migration đi, sử dụng lệnh "dotnet ef migrations add InitCreate" sau đó sử dụng lệnh "dotnet ef database update"
- Trong database, vào edit bảng roles tạo sẵn 4 role bao gồm: "Admin", "Nhân Viên", "Trưởng Bộ Phận", "Bộ Phận Quản Lý". Chú ý viết đúng định dạng, dấu cách cũng phải đúng thì frontend mới chạy được
- Trong database, trong bảng RequetsStatus tạo sẵn 4 trạng thái theo thứ tự là: "Chờ duyệt", "Trưởng bộ phận duyệt", "Từ chối", "Bộ phận quản lý duyệt" theo đúng id từ 1 đến 4. Nếu không đúng thì phải tạo database mới

*Lưu ý khi chạy frontend:
- Phải chạy lệnh "npm install" để cài đặt các thư viện cần thiết
 
