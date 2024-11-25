Dropzone.autoDiscover = false;

// Dropzone 설정
const myDropzone = new Dropzone("#my-dropzone", {
    autoProcessQueue: false,
    url: "/updateFiles", // Node.js 백엔드의 업로드 경로
    paramName: "profileImg", // Multer에 지정한 필드 이름과 일치
    uploadMultiple: false, // 단일 파일 업로드
    maxFilesize: 5, // 최대 파일 크기: 5MB
    parallelUploads: 5,// 동시에 업로드할 파일 수
    acceptedFiles: "image/*", // 이미지 파일만 허용
    addRemoveLinks: true, // 파일 삭제 링크

    init: function () {
        this.on("addedfile", (file) => {
            console.log("🚀 파일 추가:", file.name);

            initialFileCount = this.files.length; // 현재 파일 개수 추적
            console.log("🚀 ~ FileCount:", initialFileCount)

        });
        this.on("removedfile", (file) => {
            if (isResetting) {
                // Dropzone 초기화로 인해 삭제된 경우 로그 출력 생략
                return;
            }
            console.log("🚀 파일 삭제:", file.name);
            initialFileCount = this.files.length; // 파일 삭제 후 파일 개수 갱신
        });

        this.on("queuecomplete", () => {
            console.log("🚀 모든 파일 업로드 완료");
            alert("모든 파일 업로드 완료");

            // Dropzone 초기화
            isResetting = true; // 초기화 시작
            myDropzone.removeAllFiles(true); // 모든 파일 제거
            console.log("🚀 Dropzone 초기화 완료");
            isResetting = false; // 초기화 종료
        });
        this.on("success", (file, response) => {
            console.log("🚀 업로드 성공 - 파일:", file.name);
            console.log("json:", response);
        });
        this.on("error", (file, errorMessage) => {
            console.log("🚀 업로드 실패:", errorMessage);
        });
        this.on("error", (file, errorMessage, xhr) => {
            console.log("🚀 업로드 실패 - 파일:", file.name);
            try {
                const errorResponse = JSON.parse(xhr.responseText);
                console.log("❌(JSON):", errorResponse);
            } catch (e) {
                console.error("❌을 JSON으로 파싱할 수 없습니다:", xhr.responseText);
            }
        });
    },
});

document.getElementById("upBtn").addEventListener("click", () => {// 업로드 버튼 동작
    if (myDropzone.files.length === 0) {
        alert("파일을 추가해주세요.");
        return;
    }
    myDropzone.processQueue(); // 큐에 있는 파일 업로드
});