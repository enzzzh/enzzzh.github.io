const DID_ID = "1250827442831101973";

function setStatus(status, activityLabel) {
	const dot = document.getElementById("status-dot");
	const text = document.getElementById("status-text");
	const activity = document.getElementById("discord-activity");
	const name = document.getElementById("discord-name");

	if (status && status !== "unknown") {
		const statusClass = (status === "dnd" || status === "idle" || status === "online") ? status : "offline";
		["online", "idle", "dnd", "offline"].forEach(c => dot.classList.toggle(c, c === statusClass));
		text.textContent = status === "online"
			? "Chronically online"
			: status === "idle"
				? "Sleeping"
				: status === "dnd"
					? "If you ping me I kill u "
					: "Offline";
	}

	if (activityLabel) {
		activity.textContent = activityLabel;
	}

	if (name && name.textContent === "Loading status...") {
		name.textContent = "Discord";
	}
}

function getActivity(presence) {
	const activities = presence.activities || [];
	const active = activities
		.filter(a => a.type === 0 || a.type === 1 || a.type === 2 || a.type === 4)
		.sort((a, b) => b.created_at - a.created_at)[0];
	if (!active) return "Doing nothing ig";
	return "Playing " + active.name;
}

async function checkStatus() {
	try {
		const res = await fetch(`https://api.lanyard.rest/v1/users/${DID_ID}`);
		if (!res.ok) throw new Error("bad response");
		const { data } = await res.json();
		setStatus(data.discord_status, getActivity(data));
	} catch {
		setStatus("unknown", "No fetch status");
	}
}

checkStatus();
setInterval(checkStatus, 30000);

function navigate(page) {
	document.querySelectorAll(".page").forEach(p => p.classList.toggle("active", p.id === "page-" + page));
	document.querySelectorAll(".secheng-list a[data-page]").forEach(a => a.classList.toggle("active", a.dataset.page === page));
}

document.querySelectorAll(".secheng-list a[data-page]").forEach(link => {
	link.addEventListener("click", e => {
		e.preventDefault();
		navigate(link.dataset.page);
	});
});

const secheng = document.getElementById("secheng");
const toggleBtn = document.getElementById("secheng-toggle");

toggleBtn.addEventListener("click", () => {
	secheng.classList.toggle("hidden");
});

