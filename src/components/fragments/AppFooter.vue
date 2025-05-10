<template>
    <footer class="app-footer">
      <div class="container">
        <p class="footer-text">© 2025 Questory. All rights reserved.</p>
        <div class="footer-links">
          <a href="#">이용약관</a>
          <a href="#">개인정보처리방침</a>
          <a href="#">문의하기</a>
        </div>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: "AppFooter",
  };
  </script>
  
  <style scoped>
  .app-footer {
    border-top: 1px solid #ddd;
    background-color: #f9f9f9;
    padding: 16px 0;
    margin-top: 48px;
    font-size: 14px;
    color: #666;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .footer-text {
    margin: 0;
  }
  
  .footer-links {
    display: flex;
    gap: 16px;
  }
  
  .footer-links a {
    color: #666;
    text-decoration: none;
  }
  
  .footer-links a:hover {
    text-decoration: underline;
  }
  </style>
  