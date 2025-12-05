import styled from 'styled-components';
import Dropdown from 'react-bootstrap/Dropdown';

export const StyledDropdown = styled(Dropdown)`
  display: flex;
  justify-content: flex-end;

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
`;
