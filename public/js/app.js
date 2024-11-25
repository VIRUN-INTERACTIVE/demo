Dropzone.autoDiscover = false;

// Dropzone 설정
const myDropzone = new Dropzone("#my-dropzone", {
    autoProcessQueue: false, // 수동 업로드 처리
    url: "/updateFiles", // 업로드 경로
    paramName: function() { return "profileImg"; }, // 모든 파일 이름을 "files"로 고정
    uploadMultiple: true, // 다중 업로드 활성화
    parallelUploads: 5, // 동시에 업로드할 파일 수
    acceptedFiles: "image/*", // 이미지 파일만 허용
    addRemoveLinks: true, // 파일 삭제 링크 추가
    

    init: function () {
        this.on("addedfile", (file) => {
            console.log("🚀 파일 추가:", file.name);
        });

        this.on("removedfile", (file) => {
            if (isResetting) return; // Dropzone 초기화 중 삭제 이벤트 무시
            console.log("🚀 파일 삭제:", file.name);
        });

        this.on("successmultiple", (files, response) => {
            console.log("🚀 모든 파일 업로드 성공!");
            console.log("서버 응답:", response);
            alert("모든 파일 업로드가 완료되었습니다!");
        });

        this.on("errormultiple", (files, response) => {
            console.error("❌ 파일 업로드 실패:", response);
            alert("업로드 중 오류가 발생했습니다.");
        });

        this.on("queuecomplete", () => {
            console.log("🚀 큐 내 모든 파일 처리 완료");
            alert("큐 내 모든 파일이 처리되었습니다.");
            
            // Dropzone 초기화
            isResetting = true;
            myDropzone.removeAllFiles(true); // 모든 파일 제거
            isResetting = false;
        });

        this.on("error", (file, errorMessage, xhr) => {
            console.log("🚀 업로드 실패 - 파일:", file.name);
            alert("업로드 실패: " + errorMessage);
            try {
                const errorResponse = JSON.parse(xhr.responseText);
                console.log("❌(JSON):", errorResponse);
            } catch (e) {
                console.error("❌ JSON으로 파싱할 수 없는 응답:", xhr.responseText);
            }
        });
    },
});

// 업로드 버튼 동작
document.getElementById("upBtn").addEventListener("click", () => {
    if (myDropzone.files.length === 0) {
        alert("파일을 추가해주세요.");
        return;
    }
    myDropzone.processQueue(); // 큐에 있는 파일 업로드
});
