import { useEffect, useState } from 'react';

const DID_ID = "1250827442831101973";

const NAV_LINKS = [
	{ page: 'home', label: 'home/' },
	{ page: 'skills', label: 'skills/' },
];

export default function App() {
	const [page, setPage] = useState('home');
	const [hidden, setHidden] = useState(false);
	const [dotClass, setDotClass] = useState('offline');
	const [statusText, setStatusText] = useState('Checking...');
	const [activity, setActivity] = useState('No activity');
	const [name, setName] = useState('Loading status...');

	useEffect(() => {
		function setStatus(status, activityLabel) {
			if (status && status !== "unknown") {
				const statusClass = (status === "dnd" || status === "idle" || status === "online") ? status : "offline";
				setDotClass(statusClass);
				setStatusText(status === "online"
					? "Chronically online"
					: status === "idle"
						? "Sleeping"
						: status === "dnd"
							? "If you ping me I kill u "
							: "Offline");
			}

			if (activityLabel) {
				setActivity(activityLabel);
			}

			setName(prev => prev === "Loading status..." ? "Discord" : prev);
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
		const interval = setInterval(checkStatus, 30000);
		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<button id="secheng-toggle" className="secheng-toggle" onClick={() => setHidden(h => !h)}>||</button>

			<div className={`secheng ${hidden ? "hidden" : ""}`} id="secheng">
				<div className="secheng-header">" Directory Listing</div>
				<div className="secheng-path">" /</div>
				<ul className="secheng-list">
					{NAV_LINKS.map(link => (
						<li key={link.page}>
							<a
								href="#"
								data-page={link.page}
								className={`dir ${page === link.page ? "active" : ""}`}
								onClick={e => { e.preventDefault(); setPage(link.page); }}
							>
								{link.label}
							</a>
						</li>
					))}
				</ul>
			</div>

			<main>
				<section id="page-home" className={`page ${page === "home" ? "active" : ""}`}>
					<div className="yo">
						<h1>Welcome</h1>
						<p>To the most horrific website made by a random </p>
						<br />
						<i>for fun</i> <br />
						<img src="pfp.jpg" />
					</div>

					<div className="status-card">
						<h3 id="discord-name">{name}</h3>
						<p>
							<span id="status-dot" className={`status-indicator ${dotClass}`}></span>
							<span id="status-text">{statusText}</span>
						</p>
						<p id="discord-activity" style={{ fontSize: "0.9em", color: "#b9bbbe" }}>{activity}</p>
					</div>

					<div className="search">

					</div>
				</section>

				<section id="page-skills" className={`page ${page === "skills" ? "active" : ""}`}>
					<div className="techshit">
						<h2>Skillz (googled once):</h2>
						<a href="https://skillicons.dev">
							<img
								src="https://skillicons.dev/icons?i=c,docker,js,py,bash,git,vim,java,latex,linux" />
						</a>
					</div>
					<div className="projects">
						<h3>Things I did for the love of the game: </h3>
						<li><a href="https://github.com/enzzzh/CoolDockerProjects"> Cool docker projects </a>
						</li>
						<li><a href="https://github.com/enzzzh/PomodoroAppMobile">Pomodoro app mobile </a></li>
						<li><a href="https://github.com/enzzzh/AuTUI"> Work in progress ig </a></li>
					</div>
				</section>
			</main>
		</>
	);
}