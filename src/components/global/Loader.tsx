"use client";

import React from "react";
import styled from "styled-components";

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader">Loading</div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .loader {
    font-size: 2rem;
    font-family: sans-serif;
    font-variant: small-caps;
    font-weight: 900;
    background: conic-gradient(
      #dff2ae 0 25%,
      #ff904f 25% 50%,
      #feefe7 50% 75%,
      #ffde2b 75%
    );
    background-size: 200% 200%;
    animation: animateBackground 4.5s ease-in-out infinite;
    color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
  }

  @keyframes animateBackground {
    25% {
      background-position: 0 100%;
    }

    50% {
      background-position: 100% 100%;
    }

    75% {
      background-position: 100% 0%;
    }

    100% {
      background-position: 0 0;
    }
  }
`;

export default Loader;
