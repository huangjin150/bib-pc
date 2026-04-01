<template>
	<div class="notice-detail-page dark-skin">
		<div class="box">
			<!-- 面包屑导航 -->
			<div class="breadcrumb">
				<span class="breadcrumb-item" @click="goToHome">首页</span>
				<span class="separator">/</span>
                <span class="breadcrumb-item" @click="$router.push('/announcement/1')">公告中心</span>
				<span class="separator">/</span>
				<span class="breadcrumb-item" @click="goToCategory(notice.announcementClassification)">{{
					getCategoryTitle(notice.announcementClassification) }}</span>
				<span class="separator">/</span>
				<span class="breadcrumb-item current">{{ notice.title }}</span>
			</div>

			<div class="detail-container">
				<!-- 中间内容区域 -->
				<div class="content-wrapper">
                    <div class="content">
                        <div class="content-header">
                            <h1 class="article-title">{{ notice.title }}</h1>
                            <div class="content-meta">
                                <span class="date">{{ notice.createTime }}</span>
                            </div>
                        </div>
                        <div class="content-body" v-html="notice.content"></div>
                        
                        <div class="content-footer">
                            <div class="back-btn" @click="$router.go(-1)">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="19" y1="12" x2="5" y2="12"></line>
                                    <polyline points="12 19 5 12 12 5"></polyline>
                                </svg>
                                <span>返回列表</span>
                            </div>
                        </div>
                    </div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {
	marketItems
} from "./data.js";
export default {
	data() {
		return {
			notice: {
				id: null,
				title: '',
				date: '',
				content: '',
				categoryId: '1'
			},
			sidebarItems: [{
				id: marketItems[0].id,
				title: marketItems[0].title,
				icon: '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"></path></svg>'
			},
			{
				id: marketItems[1].id,
				title: marketItems[1].title,
				icon: '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M4 2v20h16V2H4zm14 18H6V4h12v16z" fill="currentColor"></path></svg>'
			},
			{
				id: marketItems[2].id,
				title: marketItems[2].title,
				icon: '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" fill="currentColor"></path></svg>'
			},
			{
				id: marketItems[3].id,
				title: marketItems[3].title,
				icon: '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" fill="currentColor"></path></svg>'
			},
			{
				id: marketItems[4].id,
				title: marketItems[4].title,
				icon: '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"></path></svg>'
			},
			{
				id: marketItems[5].id,
				title: marketItems[5].title,
				icon: '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 3L6 7.58V6H4v3.11L1 11.4l1.21 1.59L4 11.62V21h16v-9.38l1.79 1.36L23 11.4 12 3zm6 16h-5v-4h-2v4H6v-8.9l6-4.58 6 4.58V19z" fill="currentColor"></path></svg>'
			},
			{
				id: marketItems[6].id,
				title: marketItems[6].title,
				icon: '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" fill="currentColor"></path></svg>'
			},
			],
		}
	},
	created() {
		const noticeId = parseInt(this.$route.params.id);
		if (noticeId) {
			this.loadNoticeDetail(noticeId);
		}
	},
	methods: {
		loadNoticeDetail(noticeId) {
			// 查找对应的公告
			this.$http.get(this.host + "/announcement/" + noticeId, {}).then(response => {
				var resp = response.body;
				if (resp.code == 0) {
					this.notice = resp.data
				} else {
					this.$Message.error(resp.message);
				}
			});
		},
		goToCategory(categoryId) {
			this.$router.push(`/announcementList/${categoryId}`);
		},
		goToDetail(noticeId) {
			this.$router.push(`/announcementItem/${noticeId}`);
		},
		goBack() {
			this.$router.go(-1);
		},

		goToHome() {
			this.$router.push('/');
		},
		getCategoryTitle(categoryId) {
			const category = this.sidebarItems.find(item => item.id === categoryId + "");
			return category ? category.title : '';
		}
	}
}
</script>

<style lang="scss" scoped>
.dark-skin {
	background-color: #000;
	color: #fff;
	min-height: 100vh;
    padding-bottom: 60px;
}

.box {
	max-width: 1000px;
	margin: 0 auto;
    padding: 0 24px;
}

/* 面包屑导航 */
.breadcrumb {
	padding: 32px 0;
	display: flex;
	align-items: center;
	font-size: 14px;
	color: #888;

	.breadcrumb-item {
		cursor: pointer;
		transition: color 0.3s ease;

		&:hover {
			color: #d4ff00;
		}
	}

	.current {
		color: #fff;
		font-weight: 500;
	}

	.separator {
		margin: 0 12px;
		color: #444;
	}
}

.detail-container {
	display: flex;
	justify-content: center;
}

.content-wrapper {
    width: 100%;
    background: #0c0c0c;
    border: 1px solid #1a1a1a;
    border-radius: 16px;
    padding: 60px;
    margin-bottom: 40px;
}

.content-header {
	margin-bottom: 40px;
	border-bottom: 1px solid #1a1a1a;
	padding-bottom: 30px;

	.article-title {
		font-size: 32px;
		font-weight: 600;
		color: #fff;
		line-height: 1.4;
		margin: 0 0 20px 0;
	}
}

.content-meta {
	display: flex;
	align-items: center;
	
	.date {
		font-size: 14px;
		color: #888;
        display: flex;
        align-items: center;
        gap: 8px;

        &::before {
            content: '';
            display: inline-block;
            width: 16px;
            height: 16px;
            background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="%23888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 6V12L16 14" stroke="%23888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
            background-size: cover;
        }
	}
}

.content-body {
	font-size: 16px;
	line-height: 1.8;
	color: #e0e0e0;
    min-height: 300px;

	::v-deep {
		p {
			margin-bottom: 1.5em;
		}

		h1, h2, h3, h4, h5, h6 {
			color: #fff;
			margin-top: 2em;
			margin-bottom: 1em;
			font-weight: 600;
		}

		a {
			color: #d4ff00;
			text-decoration: none;
			
			&:hover {
				text-decoration: underline;
			}
		}

		img {
			max-width: 100%;
			height: auto;
			border-radius: 8px;
			margin: 1.5em 0;
		}

		ul, ol {
			margin-bottom: 1.5em;
			padding-left: 2em;
			
			li {
				margin-bottom: 0.5em;
			}
		}
        
        strong, b {
            color: #fff;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 2em 0;
            color: #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
            border-style: hidden;
            box-shadow: 0 0 0 1px #1a1a1a;
            
            th, td {
                padding: 12px 16px;
                border: 1px solid #1a1a1a;
                text-align: left;
            }
            
            th {
                background-color: #111113;
                font-weight: 600;
                color: #fff;
            }
            
            tr:nth-child(even) {
                background-color: rgba(255, 255, 255, 0.02);
            }
        }
	}
}

.content-footer {
    margin-top: 60px;
    padding-top: 30px;
    border-top: 1px solid #1a1a1a;
    display: flex;
    justify-content: flex-start;
    
    .back-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #888;
        cursor: pointer;
        font-size: 15px;
        transition: all 0.3s ease;
        padding: 10px 20px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.03);
        
        &:hover {
            color: #000;
            background: #d4ff00;
            transform: translateX(-4px);
        }
    }
}

@media (max-width: 768px) {
    .content-wrapper {
        padding: 30px 20px;
    }
    
	.content-header .article-title {
		font-size: 24px;
	}
    
    .box {
        padding: 0 16px;
    }
}
</style>