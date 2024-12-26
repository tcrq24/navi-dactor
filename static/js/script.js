document.addEventListener('DOMContentLoaded', function() {
  // 폼 제출 처리 (사용자 이름과 비밀번호 확인)
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function(event) {
      const username = form.querySelector('input[name="username"]').value;
      const password = form.querySelector('input[name="password"]').value;
      if (!username || !password) {
        alert("모든 필드를 채워주세요.");
        event.preventDefault();
      }
    });
  }

  

});

//이미지 업로드
document.addEventListener('DOMContentLoaded', function() {

    // 이미지 업로드 폼 처리
    const uploadForm = document.querySelector('form[action="/upload"]');
    const uploadButton = uploadForm ? uploadForm.querySelector('button[type="submit"]') : null;
    const fileInput = uploadForm ? uploadForm.querySelector('input[type="file"]') : null;
  
    // Enter 키로 이미지 업로드 버튼 클릭
    if (fileInput && uploadButton) {
      fileInput.addEventListener('keydown', function(e) {
        if (e.key === "Enter") {
          e.preventDefault(); // 기본 Enter 동작 방지
          uploadButton.click(); // 업로드 버튼 클릭
        }
      });
    }
  
  });



// 하이라이트

document.addEventListener('DOMContentLoaded', function() {

  // 이미지 업로드 폼 처리
  const uploadForm = document.querySelector('form[action="/highlight"]');
  const uploadButton = uploadForm ? uploadForm.querySelector('button[type="submit"]') : null;
  const fileInput = uploadForm ? uploadForm.querySelector('input[type="file"]') : null;

  // Enter 키로 이미지 업로드 버튼 클릭
  if (fileInput && uploadButton) {
    fileInput.addEventListener('keydown', function(e) {
      if (e.key === "Enter") {
        e.preventDefault(); // 기본 Enter 동작 방지
        uploadButton.click(); // 업로드 버튼 클릭
      }
    });
  }

});


// 캘린더



document.addEventListener('DOMContentLoaded', function () {
  
  // 이전, 다음 버튼 클릭 시 월과 연도 변경
    document.getElementById('prev').addEventListener('click', function() {
      var year = parseInt(this.getAttribute('data-year'));
      var month = parseInt(this.getAttribute('data-month'));

      if (month === 1) {  // 1월이면 연도를 감소시키고 12월로 설정
          year -= 1;
          month = 12;
      } else {  // 그렇지 않으면 월을 감소
          month -= 1;
      }

      // URL 쿼리 파라미터에 변경된 year, month를 전달하여 페이지를 새로고침
      window.location.href = `/calendar?year=${year}&month=${month}`;
    });

    document.getElementById('next').addEventListener('click', function() {
        var year = parseInt(this.getAttribute('data-year'));
        var month = parseInt(this.getAttribute('data-month'));

        if (month === 12) {  // 12월이면 연도를 증가시키고 1월로 설정
            year += 1;
            month = 1;
        } else {  // 그렇지 않으면 월을 증가
            month += 1;
        }

        // URL 쿼리 파라미터에 변경된 year, month를 전달하여 페이지를 새로고침
        window.location.href = `/calendar?year=${year}&month=${month}`;
    });

    document.querySelectorAll('.clickable-day').forEach(function(dayElement) {
      dayElement.addEventListener('click', function() {
          var selectedDate = this.getAttribute('data-date');
          var eventElement = this.querySelector('.event');
  
          // 모달에 선택한 날짜 설정
          document.getElementById('eventDate').value = selectedDate;
  
          // 이미 일정이 있을 경우
          if (eventElement) {
              var eventTitle = eventElement.textContent;
  
              // 수정/삭제 버튼 보이기
              document.getElementById('eventTitle').value = eventTitle;
              document.getElementById('updateEventBtn').style.display = 'inline-block';
              document.getElementById('deleteEventBtn').style.display = 'inline-block';
              document.getElementById('saveEventBtn').style.display = 'none';
          } else {
              // 일정이 없으면 새 일정 추가
              document.getElementById('eventTitle').value = '';
              document.getElementById('updateEventBtn').style.display = 'none';
              document.getElementById('deleteEventBtn').style.display = 'none';
              document.getElementById('saveEventBtn').style.display = 'inline-block';
          }
  
          // 모달을 표시합니다.
          document.getElementById('eventModal').style.display = 'block';
      });
  });
  
  // 모달 닫기 버튼
  document.getElementById('closeModalBtn').addEventListener('click', function() {
      document.getElementById('eventModal').style.display = 'none';
  });
  
  // 일정 저장
  document.getElementById('eventForm').addEventListener('submit', function(e) {
      e.preventDefault(); // 폼 제출 막기
      
      var eventDate = document.getElementById('eventDate').value;
      var eventTitle = document.getElementById('eventTitle').value;
      var eventId = document.getElementById('eventId').value;
  
      if (eventId) {
          // 일정 수정
          fetch('/update_event', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  id: eventId,
                  date: eventDate,
                  title: eventTitle
              })
          })
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                  updateEventOnCalendar(eventDate, eventTitle);
                  document.getElementById('eventModal').style.display = 'none';
              }
          });
      } else {
          // 일정 추가
          fetch('/save_event', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  date: eventDate,
                  title: eventTitle
              })
          })
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                  alert('일정이 추가되었습니다.');
                  addEventToCalendar(eventDate, eventTitle);
                  document.getElementById('eventModal').style.display = 'none';
              }
          });
      }
      document.getElementById('eventModal').style.display = 'none';
  });
  
  // 일정 수정 함수
  document.getElementById('updateEventBtn').addEventListener('click', function() {
    const eventDate = document.getElementById('eventDate').value;
    const eventTitle = document.getElementById('eventTitle').value;

    fetch('/update_event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: eventDate, title: eventTitle }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('일정이 수정되었습니다.');
            location.reload();  // 페이지 새로 고침
        }
    })
    .catch(error => {
        alert('일정 수정 실패');
        console.error(error);
    });

    // 수정 모달 닫기
    document.getElementById('eventModal').style.display = 'none';
});
  
  // 일정 추가 함수
  function addEventToCalendar(eventDate, eventTitle) {
      var dateElements = document.querySelectorAll('.clickable-day');
      dateElements.forEach(function(element) {
          if (element.getAttribute('data-date') === eventDate) {
              var eventDiv = document.createElement('div');
              eventDiv.classList.add('event');
              eventDiv.textContent = eventTitle;
              element.appendChild(eventDiv);
          }
      });
  }
  
  // 일정 삭제
  document.getElementById('deleteEventBtn').addEventListener('click', function() {
      var eventDate = document.getElementById('eventDate').value;
  
      fetch('/delete_event', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ date: eventDate })
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
            alert('일정이 삭제되었습니다.');
              removeEventFromCalendar(eventDate);
              document.getElementById('eventModal').style.display = 'none';
          }
      });
      document.getElementById('eventModal').style.display = 'none';
  });
  
  // 일정 삭제 함수
  function removeEventFromCalendar(eventDate) {
      var dateElements = document.querySelectorAll('.clickable-day');
      dateElements.forEach(function(element) {
          if (element.getAttribute('data-date') === eventDate) {
              var eventDiv = element.querySelector('.event');
              if (eventDiv) {
                  element.removeChild(eventDiv);
              }
          }
      });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  // 챗봇 입력 처리
  const sendBtn = document.getElementById('send-btn');
  const userInput = document.getElementById("user-input");

  // Enter키로 챗봇 전송 버튼 클릭
  userInput.addEventListener('keydown', function(e) {
    if (e.key === "Enter") {
      e.preventDefault();  // 기본 Enter 동작 방지
      sendBtn.click();  // 전송 버튼 클릭
    }

});

// 챗봇 전송 버튼 클릭 시 처리
sendBtn.onclick = function(event) {
  event.preventDefault();  // 기본 동작 방지 (폼 제출, 페이지 리로드 등)

  var input = userInput.value.trim();
  if (input) {
    fetch('/chatbot-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: input })
    })
    .then(response => response.json())
    .then(data => {
      var chatBox = document.getElementById('chat-box');
      
      var userMessage = document.createElement('div');
      userMessage.className = 'user';
      userMessage.textContent = input;
      chatBox.appendChild(userMessage);

      var botMessage = document.createElement('div');
      botMessage.className = 'bot';
      botMessage.textContent = data.response;
      chatBox.appendChild(botMessage);

      userInput.value = '';  // 입력란 비우기
      chatBox.scrollTop = chatBox.scrollHeight;  // 최신 메시지로 스크롤
    })
    .catch(error => console.error('Error:', error));
  }
};

});








document.addEventListener('DOMContentLoaded', function() {

  $(".top").click(function(){
    $("body, html").stop().animate({
      scrollTop:0
    });
    return false;
  });

});

