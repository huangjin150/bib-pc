<template>
    <div class="security-center">
        <!-- 双重验证区域 -->
        <div class="two-factor-section">
            <h2 class="section-title">安全设置</h2>

            <!-- 登录密码 -->
            <div class="security-item">
                <div class="item-icon">
                    <img src="../../assets/svg/pwdIcon.aa51bedb.svg" alt="">
                </div>
                <div class="item-content">
                    <h3 class="item-title">登录密码</h3>
                </div>
                <div class="item-actions">
                    <button @click="showChangePasswordModal = true" class="btn-modify">修改</button>
                </div>
            </div>

            <!-- 邮箱验证 -->
            <div class="security-item">
                <div class="item-icon">
                    <img src="../../assets/svg/emailIcon.svg" alt="">
                </div>
                <div class="item-content">
                    <h3 class="item-title">邮箱</h3>
                    <p class="item-desc">该邮箱验证码有助于保护您的账户与交易安全</p>
                </div>
                <div class="email-display">
                    <span class="email-text">{{ maskedEmail }}</span>
                    <button v-if="settingData && settingData.emailVerified == 0" class="btn-secondary"
                        @click="showBindEmailModal = true">
                        绑定</button>
                    <button class="btn-secondarynone" disabled v-else>已绑定</button>
                </div>
            </div>

            <!-- 手机验证 -->
            <div class="security-item">
                <div class="item-icon">
                    <img src="../../assets/svg/phoneIcon.svg" alt="">
                </div>
                <div class="item-content">
                    <h3 class="item-title">手机</h3>
                    <p class="item-desc">短信验证码有助于保护您的账户与交易安全</p>
                </div>
                <div class="phone-actions">
                    <span class="email-text" v-if="settingData && settingData.phoneVerified == 0">{{
                        hidePhoneNumber(maskedPhone)
                    }}</span>
                    <button class="btn-secondary" v-if="settingData && settingData.phoneVerified == 0"
                        @click="showBindPhoneModal = true">绑定</button>
                    <button class="btn-secondarynone" disabled v-else>已绑定</button>
                </div>
            </div>

            <!-- 资金密码 -->
            <div class="security-item">
                <div class="item-icon">
                    <img style="width: 32px; height: 32px;" src="../../assets/images/fund.png" alt="">
                </div>
                <div class="item-content">
                    <h3 class="item-title">资金密码</h3>
                    <p class="item-desc">修改您的资金密码</p>
                </div>
                <div class="phone-actions">
                    <button class="btn-secondary" @click="showSetFundPasswordModal = true">{{
                        settingData && settingData.fundsVerified == 0 ? '设置' : '修改' }}</button>
                </div>
            </div>
        </div>
        <div v-if="showChangePasswordModal">
            <ChangePasswordModal :visible="showChangePasswordModal" @close="showChangePasswordModal = false" />
        </div>
        <div v-if="showBindPhoneModal">
            <BindPhoneModal :visible="showBindPhoneModal" @close="showBindPhoneModal = false" />
        </div>
        <div v-if="showSetFundPasswordModal">
            <SetFunPasswordModal :visible="showSetFundPasswordModal" @close="showSetFundPasswordModal = false" />
        </div>
        <div v-if="showBindEmailModal">
            <BindEmailModal :visible="showBindEmailModal" @close="showBindEmailModal = false" />
        </div>
    </div>
</template>

<script>
import ChangePasswordModal from './components/ChangePasswordModal.vue';
import BindPhoneModal from './components/BindPhoneModal.vue';
import SetFunPasswordModal from './components/SetFunPasswordModal.vue';
import BindEmailModal from './components/BindEmailModal.vue';
export default {
    name: 'Security',
    components: {
        ChangePasswordModal,
        BindPhoneModal,
        SetFunPasswordModal,
        BindEmailModal
    },
    computed: {
        maskedEmail() {
            const email = this.$store.state.setting.email || '';
            return this.maskEmail(email);
        },
        maskedPhone() {
            const phone = this.$store.state.setting.mobilePhone || '';
            return this.maskEmail(phone);
        },
        storeSetting() {
            return this.$store.state.setting
        }
    },
    watch: {
        storeSetting: {
            handler(newVal) {
                if (newVal) {
                    this.settingData = newVal
                }
            },
            immediate: true
        }
    },
    data() {
        return {
            showChangePasswordModal: false,
            showBindPhoneModal: false,
            showSetFundPasswordModal: false,
            showBindEmailModal: false,
            settingData: null,

        };
    },
    methods: {
        maskEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return email;
            }

            const [username, domain] = email.split('@');

            if (username.length <= 3) {
                return username.charAt(0) + '**@' + domain;
            }

            const maskedUsername = username.substring(0, 2) + '**' + username.substring(username.length - 1);
            return maskedUsername + '@' + domain;
        },
        hidePhoneNumber(phone) {
            if (!phone || phone.length !== 11) {
                return phone;
            }
            return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.settingData = this.$store.state.setting
        })
    },
};
</script>

<style scoped>
.security-center {
    margin-top: 15px;
    background: #fff;
}

.security-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid #f0f0f0;
}

.page-title {
    font-size: 28px;
    font-weight: 600;
    color: #333;
    margin: 0;
}

.login-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
}

.login-text {
    font-size: 14px;
    color: #666;
}

.security-level {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #fff7e6;
    border: 1px solid #ffd591;
    border-radius: 20px;
}

.level-icon {
    font-size: 16px;
}

.level-text {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.level-label {
    font-size: 14px;
    font-weight: 600;
    color: #fa8c16;
}

.level-desc {
    font-size: 12px;
    color: #666;
}

.two-factor-section {
    border: 1px solid #eaeaed;
    border-radius: 16px;
}

.section-title {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    padding: 24px;
    border-bottom: 1px solid #eaeaed;

}

.security-item {
    height: 74px;
    display: flex;
    align-items: center;
    padding: 0 24px;
    gap: 16px;
}

.security-item:last-child {
    border-bottom: none;
}

.item-icon {
    font-size: 24px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    flex-shrink: 0;
}

.item-content {
    flex: 1;
}

.item-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 3px 0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.recommended-tag {
    background: #52c41a;
    color: white;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: normal;
}

.item-desc {
    font-size: 14px;
    color: #666;
    line-height: 1.5;
}

.email-display,
.google-status,
.phone-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.email-text {
    font-size: 14px;
    color: #333;
    font-weight: 500;
}


.item-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.btn-primary {
    min-width: 140px;
    height: 40px;
    background: #000;
    color: white;
    border: none;
    padding: 13px 16px;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    cursor: pointer;
}

.btn-primary:hover {
    --un-bg-opacity: 1;
    background-color: rgba(208, 245, 0, var(--un-bg-opacity))
}

.btn-secondary {
    min-width: 140px;
    height: 40px;
    background: transparent;
    border: 1px solid #d9d9d9;
    padding: 13px 16px;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-secondarynone {
    min-width: 140px;
    height: 40px;
    background: transparent;
    border: 1px solid #d9d9d9;
    padding: 13px 16px;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-secondary:hover {
    --un-bg-opacity: 1;
    background-color: rgba(208, 245, 0, var(--un-bg-opacity))
}

.btn-modify {
    background: transparent;
    border: 1px solid #eaeaed;
    min-width: 140px;
    height: 40px;
    padding: 13px 16px;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    cursor: pointer;
}

.btn-modify:hover {
    --un-bg-opacity: 1;
    background-color: rgba(208, 245, 0, var(--un-bg-opacity))
}

.btn-dark {
    background: #333;
    color: white;
    border: none;
    padding: 8px 24px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.btn-dark:hover {
    background: #555;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .security-center {
        padding: 16px;
    }

    .security-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .security-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .email-display,
    .google-status,
    .phone-actions {
        flex-wrap: wrap;
    }

    .item-actions {
        width: 100%;
        justify-content: flex-start;
    }
}
</style>