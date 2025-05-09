<template>
    <div class="social-login">
        <button>
            <img src="../../assets/images/social/Kakao Social Login Button.png" alt="kakao" class="social-icon" />
        </button>
        <button>
            <img src="../../assets/images/social/Naver Social Login Button.png" alt="naver" class="social-icon" />
        </button>
        <button>
            <img src="../../assets/images/social/Google Social Login Button.png" alt="google" class="social-icon" />
        </button>
    </div>
</template>
<style>
.social-login {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.social-login button {
    background: none;
    border: none;
    padding: 0;
}

.social-icon {
    width: 4em;
    height: 4em;
    max-width: 48px;
    max-height: 48px;
    object-fit: contain;
}

@media screen and (max-width: 480px) {
    .social-icon {
        width: 3.5em;
        height: 3.5em;
    }

    .social-login {
        gap: 0.75rem;
    }
}
</style>
