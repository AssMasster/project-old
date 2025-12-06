import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledButton = styled(Link)`
  display: inline-block;
  position: relative;
  padding: 10px 20px;
  border-radius: 7px;
  border: 1px solid rgb(126, 61, 255);
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 2px;
  background: transparent;
  color: #fff;
  overflow: hidden;
  box-shadow: 0 0 0 0 transparent;
  transition: all 0.2s ease-in;
  text-decoration: none;
  cursor: pointer;
  margin-top: 100px;

  &:hover {
    background: rgb(96, 12, 241);
    box-shadow: 0 0 30px 5px rgba(0, 142, 236, 0.815);
    transition: all 0.2s ease-out;
  }

  &:hover::before {
    animation: sh02 0.5s 0s linear;
  }

  &::before {
    content: '';
    display: block;
    width: 0px;
    height: 86%;
    position: absolute;
    top: 7%;
    left: 0%;
    opacity: 0;
    background: #fff;
    box-shadow: 0 0 50px 30px #fff;
    transform: skewX(-20deg);
  }

  &:active {
    box-shadow: 0 0 0 0 transparent;
    transition: box-shadow 0.2s ease-in;
  }

  @keyframes sh02 {
    from {
      opacity: 0;
      left: 0%;
    }

    50% {
      opacity: 1;
    }

    to {
      opacity: 0;
      left: 100%;
    }
  }
`;

export default StyledButton;
