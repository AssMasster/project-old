import styled from 'styled-components';

const StyledChat = styled.div`
  .chat-wrapper {
    display: flex;
    flex-direction: column;
    height: 90vh;
    background: #000;
    color: #fff;
    font-family: 'Segoe UI', sans-serif;
  }

  .chat-main {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .chat-sidebar {
    width: 250px;
    background: #000;
    border-right: 1px solid #333;
    padding: 16px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    @media (max-width: 768px) {
      position: fixed;
      height: 100%;
      z-index: 1000;
    }
  }

  .channels-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-weight: 700;
    color: #fff;
  }

  .channel-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .channel-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px; /* или 100%, если в флекс-контейнере */
    display: inline-block;
  }

  .dropdown-toggle {
    background: none;
    color: #7a7777;
    border: none;
    box-shadow: none;

    &:hover {
      background-color: rgba(13, 19, 23, 0.2);
      color: #fff;
    }

    &:focus {
      box-shadow: none;
    }
  }

  .dropdown-menu {
    background-color: #000;
    border: 1px solid #333;
    min-width: 50px;

    .dropdown-item {
      color: #fff;
      background-color: #000;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: #fff;
      }
    }
  }

  .add-channel {
    background: transparent;
    color: #7a7777;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;

    &:hover {
      color: #fff;
    }
  }

  .channels-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .channel {
    padding: 10px;
    cursor: pointer;
    border-radius: 4px;
    color: #71767b;

    &.active {
      background: #1a1a1a;
      color: #fff;
    }

    &:hover {
      background: #1a1a1a;
      color: #fff;
    }
  }

  .chat-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #000;
    padding: 20px;

    @media (max-width: 768px) {
      margin-left: 250px;
      width: calc(100% - 250px);
    }
    @media (max-width: 480px) {
      margin-left: 0;
      width: 100%;
    }
  }

  .chat-title {
    border-bottom: 1px solid #333;
    padding-bottom: 8px;
    margin-bottom: 16px;

    h2 {
      margin: 0;
      font-size: 20px;
      color: #fff;
    }

    span {
      color: #71767b;
      font-size: 14px;
    }
  }

  .messages-area {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 16px;
  }

  .message-form {
    display: flex;
    gap: 10px;
    border-top: 1px solid #333;
    padding-top: 10px;
  }

  .message-input {
    flex: 1;
    padding: 10px 14px;
    border-radius: 9999px;
    border: 1px solid #333;
    font-size: 14px;
    background: #1a1a1a;
    color: #fff;
    outline: none;

    &::placeholder {
      color: #71767b;
    }
  }

  .send-button {
    background: #1d9bf0;
    border: none;
    color: white;
    font-size: 18px;
    padding: 0 14px;
    border-radius: 9999px;
    cursor: pointer;

    &:hover {
      background: #1a8cd8;
    }
  }
`;

export default StyledChat;
