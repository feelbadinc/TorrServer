import styled, { css } from 'styled-components'

export default styled.div`
  ${({
    $isButton,
    theme: {
      addDialog: { notificationSuccessBGColor, languageSwitchBGColor },
    },
  }) => css`
    display: grid;
    place-items: center;
    padding: 20px 40px;
    border-radius: 5px;

    ${$isButton &&
    css`
      background: ${notificationSuccessBGColor};
      transition: 0.2s;
      cursor: pointer;

      &:hover {
        background: ${languageSwitchBGColor};
      }
    `}

    .icon-label {
      font-size: 20px;
    }
  `}
`
