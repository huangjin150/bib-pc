const state = { conversations: {}, conversationList: [] }

function safeGet(key) {
	try {
		const raw = localStorage.getItem(key)
		return raw ? JSON.parse(raw) : null
	} catch (e) { return null }
}

function safeSet(key, value) {
	try { localStorage.setItem(key, JSON.stringify(value)) } catch (e) { }
}

function safeRemove(key) {
	try { localStorage.removeItem(key) } catch (e) { }
}

function loadState() {
	const saved = safeGet('messageList')
	if (saved && typeof saved === 'object') {
		state.conversations = saved.conversations || {}
		state.conversationList = saved.conversationList || []
	}
}

function saveState() {
	safeSet('messageList', { conversations: state.conversations, conversationList: state.conversationList })
}

function ensureConversation(conversationId) {
	if (!conversationId) return
	if (!state.conversations[conversationId]) {
		state.conversations[conversationId] = { messages: [], cursor: null, lastSeq: 0, updatedAt: Date.now() }
	}
}

function appendMessages(conversationId, payload) {
	if (!conversationId) return
	ensureConversation(conversationId)
	const list = Array.isArray(payload) ? payload : [payload]
	const existing = state.conversations[conversationId].messages
	const keys = new Set(existing.map(m => m.id || m.clientId))
	list.forEach(m => {
		const k = m.id || m.clientId
		if (!keys.has(k)) { existing.push(m); keys.add(k) }
		const seq = m.seq || m.sequence
		if (typeof seq === 'number' && seq > (state.conversations[conversationId].lastSeq || 0)) {
			state.conversations[conversationId].lastSeq = seq
		}
	})

	function toMs(v) {
		if (v == null) return 0
		if (typeof v === 'number') return String(Math.floor(v)).length === 10 ? v * 1000 : v
		if (typeof v === 'string' && /^\d+$/.test(v)) {
			const n = Number(v); return v.length === 10 ? n * 1000 : n
		}
		const d = new Date(v).getTime(); return isNaN(d) ? 0 : d
	}
	function sortKey(m) {
		const s = m.seq || m.sequence
		if (typeof s === 'number') return s
		const t = m.time || m.createdAt || m.createTime || m.timestamp || m.sendTime
		const ts = toMs(t)
		if (ts) return ts
		const idn = typeof m.id === 'number' ? m.id : (typeof m.clientId === 'number' ? m.clientId : 0)
		return idn
	}
	existing.sort((a, b) => sortKey(a) - sortKey(b))
	const last = existing.length ? existing[existing.length - 1] : null
	state.conversations[conversationId].updatedAt = last ? toMs(last.time || last.createdAt || last.createTime || last.timestamp || last.sendTime) || Date.now() : Date.now()
	saveConversation(conversationId)
	saveState()
}

function updateMessageReadStatus(conversationId, messageIds) {
	if (!conversationId || !Array.isArray(messageIds) || messageIds.length === 0) return
	const conv = state.conversations[conversationId]
	if (!conv || !conv.messages) return
	const idSet = new Set(messageIds)
	let updated = false
	conv.messages.forEach(msg => {
		if (idSet.has(msg.id)) {
			msg.readStatus = 1
			updated = true
		}
	})
	if (updated) {
		saveConversation(conversationId)
		saveState()
	}
}

function setCursor(conversationId, cursor) {
	if (!conversationId) return
	ensureConversation(conversationId)
	state.conversations[conversationId].cursor = cursor
	saveConversation(conversationId)
	saveState()
}

function setLastSeq(conversationId, seq) {
	if (!conversationId) return
	ensureConversation(conversationId)
	if (typeof seq === 'number') { state.conversations[conversationId].lastSeq = seq }
	saveConversation(conversationId)
	saveState()
}

function saveConversation(conversationId) {
	if (!conversationId) return
	ensureConversation(conversationId)
	const key = `conversation:${conversationId}`
	safeSet(key, state.conversations[conversationId])
}

function loadConversation(conversationId) {
	if (!conversationId) return
	const key = `conversation:${conversationId}`
	const data = safeGet(key)
	console.log('data11111', data)
	if (data && typeof data === 'object') {
		console.log('state.conversations', state.conversations[conversationId])
		state.conversations[conversationId] = data
	} else {
		ensureConversation(conversationId)
	}
}

function clearConversation(conversationId) {
	if (!conversationId && conversationId !== '') return
	delete state.conversations[conversationId]
	const key = `conversation:${conversationId}`
	safeRemove(key)
	saveState()
}

function setConversationList(list) {
	const arr = Array.isArray(list) ? list : [list]
	const map = new Map((state.conversationList || []).map(i => [i.id || i.conversationId, i]))
	arr.forEach(item => {
		const key = item.id || item.conversationId
		if (map.has(key)) { map.set(key, Object.assign({}, map.get(key), item)) } else { map.set(key, item) }
	})
	state.conversationList = Array.from(map.values())
	saveConversationList()
	saveState()
}

function saveConversationList() { safeSet('conversation:list', state.conversationList) }

function loadConversationList() {
	const data = safeGet('conversation:list')
	if (Array.isArray(data)) { state.conversationList = data }
}

function clearConversationList() { state.conversationList = []; safeRemove('conversation:list'); saveState() }

function clearInvalidConversations() {
	if (state.conversations[undefined]) delete state.conversations[undefined]
	if (state.conversations['']) delete state.conversations['']
	saveState()
}

function getMessages(conversationId) { return (state.conversations[conversationId] && state.conversations[conversationId].messages) || [] }
function hasConversation(conversationId) { return !!state.conversations[conversationId] }
function getConversationList() { return state.conversationList || [] }
function getState() { return state }

loadState()

export default {
	ensureConversation,
	appendMessages,
	updateMessageReadStatus,
	setCursor,
	setLastSeq,
	saveConversation,
	loadConversation,
	clearConversation,
	setConversationList,
	saveConversationList,
	loadConversationList,
	clearConversationList,
	clearInvalidConversations,
	getMessages,
	hasConversation,
	getConversationList,
	getState
}