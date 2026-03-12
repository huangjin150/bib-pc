<template>
	<div class="notice-detail">
		<div class="box">

			<div class="breadcrumb">
				<span class="breadcrumb-item" @click="goToHome">首页</span>
				<span class="separator">/</span>
				<span class="breadcrumb-item" @click="goToCategory(notice.announcementClassification)">{{
					getCategoryTitle(notice.announcementClassification) }}</span>
				<span class="separator">/</span>
				<span class="breadcrumb-item current">{{ notice.title }}</span>
			</div>

			<div class="detail-container">
				<!-- 左侧导航栏 -->
				<!-- <div class="sidebar">
					<div v-for="(item, index) in sidebarItems" :key="index" class="sidebar-item"
						:class="{ active: notice.categoryId === item.id }" @click="goToCategory(item.id)">
						<span class="icon" v-html="item.icon"></span>
						<span class="text">{{ item.title }}</span>
					</div>
				</div> -->

				<!-- 中间内容区域 -->
				<div class="content">
					<div class="content-header">
						<h2>{{ notice.title }}</h2>
					</div>
					<div class="content-meta">
						<span class="date">{{ notice.createTime }}</span>
					</div>
					<div class="content-body" v-html="notice.content"></div>
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
.notice-detail {
	min-height: 100vh;
}

.box {
	max-width: 1200px;
	margin: 0 auto;
}

::v-deep(.content-body) {
	font-size: 16px;
	line-height: 1.6;
}

::v-deep(.content-body p) {
	margin-bottom: 15px;
}

::v-deep(.content-body ul),
::v-deep(.content-body ol) {
	margin-bottom: 16px;
	padding-left: 20px;
}

::v-deep(.content-body ul li),
::v-deep(.content-body ol li) {
	margin-left: 20px;
	margin-bottom: 8px;
}

::v-deep(.content-body table) {
	width: 100%;
	border-collapse: collapse;
	margin: 20px 0;
}

::v-deep(.content-body td) {
	border: 1px solid #2C3138;
	padding: 10px;
}

::v-deep(.content-body tr:nth-child(odd)) {
	background-color: #181A20;
}

.breadcrumb {
	display: flex;
	align-items: center;
	margin-bottom: 20px;
	padding: 20px 0;

	.breadcrumb-item {
		font-size: 14px;
		color: #848E9C;
		cursor: pointer;

		&:hover {
			color: #F0B90B;
		}

		&.current {
			cursor: default;

			&:hover {
				color: #EAECEF;
			}
		}
	}

	.separator {
		margin: 0 8px;
		color: #848E9C;
	}
}

.detail-container {
	display: flex;
	gap: 20px;
}

.sidebar {
	width: 220px;
	border-radius: 8px;
	padding: 10px 0;
	border: 1px solid #eaeaed;

	.back-btn {
		padding: 10px 20px;
		cursor: pointer;
		display: flex;
		align-items: center;

		&:hover {
			color: #F0B90B;
		}

		.icon {
			font-size: 20px;
			margin-right: 10px;
		}
	}

	.sidebar-item {
		padding: 12px 20px;
		cursor: pointer;
		display: flex;
		align-items: center;

		&:hover {
			background-color: #f9f9f9;
		}

		&.active {
			background-color: #2b3139;
			color: #F0B90B;
			border-left: 3px solid #F0B90B;
		}

		.icon {
			margin-right: 10px;
			display: flex;
			align-items: center;
		}
	}
}

.content {
	flex: 1;
	border-radius: 8px;
	padding: 20px;
	height: 700px;
	overflow-y: auto;
	border: 1px solid #eaeaed;

	.content-header {
		margin-bottom: 15px;

		h2 {
			font-size: 22px;
			font-weight: 500;
		}
	}

	.content-meta {
		margin-bottom: 20px;
		padding-bottom: 15px;
		border-bottom: 1px solid #2C3138;

		.date {
			font-size: 14px;
		}
	}

	.content-body {}
}

.latest-news {
	width: 280px;
	background-color: #1E2329;
	border-radius: 8px;
	padding: 20px;

	.latest-header {
		padding-bottom: 15px;
		border-bottom: 1px solid #2C3138;
		margin-bottom: 20px;

		h3 {
			font-size: 16px;
			font-weight: 500;
		}
	}

	.latest-list {
		.latest-item {
			padding: 12px 0;
			border-bottom: 1px solid #2C3138;
			cursor: pointer;

			&:hover {
				.latest-title {
					color: #F0B90B;
				}
			}

			.latest-title {
				font-size: 14px;
				margin-bottom: 6px;
				line-height: 1.4;
			}

			.latest-date {
				font-size: 12px;
			}
		}
	}
}
</style>