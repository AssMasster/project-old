import styled from 'styled-components';

const StyledWrapper = styled.div`
  .login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 400px;
    padding: 40px;
    margin: 20px auto;
    transform: translate(-50%, -55%);
    background: rgba(0, 0, 0, 0.9);
    box-sizing: border-box;
    box-shadow: 0 15px 25px rgb(146, 59, 229);
    border-radius: 10px;

    &.danger {
      box-shadow: 0 15px 25px rgb(231, 6, 6);
    }
  }

  .login-box p:first-child {
    margin: 0 0 30px;
    padding: 0;
    color: -webkit-link;
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
    letter-spacing: 1px;
  }

  /* Контейнер для каждого поля с фиксированной (минимальной) высотой */
  .login-box .user-box {
    position: relative;
    min-height: 50px; /* Фиксируем высоту, чтобы ошибка не влияла на размеры */
    margin-bottom: 20px;
  }

  /* Исходные стили для input без Bootstrap */
  .login-box .user-box input {
    width: 100%;
    padding: 10px 0;
    font-size: 16px;
    color: #fff;
    margin-bottom: 0; /* убираем отступ */
    border: none;
    border-bottom: 1px solid #fff;
    outline: none;
    background: transparent;

    &.input-error {
      border-bottom: 1px solid #ff0000 !important;
      transition: border-color 0.3s ease;
    }
  }

  .login-box .user-box label {
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px 0;
    font-size: 16px;
    color: #fff;
    pointer-events: none;
    transition: 0.5s;
  }

  .login-box .user-box input:focus ~ label,
  .login-box .user-box input:valid ~ label {
    top: -20px;
    left: 0;
    color: #fff;
    font-size: 12px;
  }

  /* Переопределяем Bootstrap-классы для полей ввода */
  .login-box .user-box .form-control {
    background: transparent !important;
    color: #fff !important;
    border: none !important;
    border-bottom: 1px solid #fff !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    outline: none !important;
    padding: 10px 0;
    font-size: 16px;
    margin-bottom: 0;
    width: 100%;
  }

  /* При фокусе */
  .login-box .user-box .form-control:focus {
    box-shadow: none !important;
    outline: none !important;
    border-bottom: 1px solid #fff !important;
  }

  .login-box .user-box .form-control:focus ~ label,
  .login-box .user-box .form-control:valid ~ label {
    top: -20px;
    left: 0;
    color: #fff;
    font-size: 12px;
  }

  /* Стили для ошибки: если поле с ошибкой, нижняя граница становится красной */
  .login-box .user-box .form-control.is-invalid {
    border-bottom: 1px solid #ff0000 !important;
  }

  /* Абсолютное позиционирование для сообщения об ошибке, чтобы оно не влияло на размеры контейнера */
  .form-error,
  .invalid-feedback {
    position: absolute;
    top: 100%; /* непосредственно под полем */
    right: 0; /* прижато к правому краю контейнера */
    color: #ff4d4d;
    font-size: 12px;
    text-align: right;
    white-space: nowrap;
    pointer-events: none;
  }

  /* Стили для кнопки с анимацией */
  .login-box form .btn {
    position: relative;
    display: inline-block;
    padding: 10px 20px;
    font-weight: bold;
    color: #fff;
    font-size: 16px;
    background: transparent;
    text-transform: uppercase;
    overflow: hidden;
    transition: 0.5s;
    margin-top: 40px;
    letter-spacing: 3px;
    border: none;
    cursor: pointer;
  }

  .login-box .btn:hover {
    background: #fff;
    color: #272727;
    border-radius: 5px;
  }

  .login-box .btn span {
    position: absolute;
    display: block;
  }

  .login-box .btn span:nth-child(1) {
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #fff);
    animation: btn-anim1 1.5s linear infinite;
  }

  .login-box .btn span:nth-child(2) {
    top: -100%;
    right: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(180deg, transparent, #fff);
    animation: btn-anim2 1.5s linear infinite;
    animation-delay: 0.375s;
  }

  .login-box .btn span:nth-child(3) {
    bottom: 0;
    right: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(270deg, transparent, #fff);
    animation: btn-anim3 1.5s linear infinite;
    animation-delay: 0.75s;
  }

  .login-box .btn span:nth-child(4) {
    bottom: -100%;
    left: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(360deg, transparent, #fff);
    animation: btn-anim4 1.5s linear infinite;
    animation-delay: 1.125s;
  }

  @keyframes btn-anim1 {
    0% {
      left: -100%;
    }
    50%,
    100% {
      left: 100%;
    }
  }

  @keyframes btn-anim2 {
    0% {
      top: -100%;
    }
    50%,
    100% {
      top: 100%;
    }
  }

  @keyframes btn-anim3 {
    0% {
      right: -100%;
    }
    50%,
    100% {
      right: 100%;
    }
  }

  @keyframes btn-anim4 {
    0% {
      bottom: -100%;
    }
    50%,
    100% {
      bottom: 100%;
    }
  }

  .login-box p:last-child {
    color: #aaa;
    font-size: 14px;
  }

  .auth-redirect {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    margin-top: 20px;

    .my-link {
      color: -webkit-link;
    }
  }

  .no-wrap {
    white-space: nowrap;
  }
`;

export default StyledWrapper;
