export type SkillGroup = { title: string; note: string; items: string[] };

export const skillGroups: SkillGroup[] = [
	{
		title: 'Languages',
		note: 'Where I actually write things.',
		items: ['Python', 'C++ (20/23)', 'C', 'TypeScript', 'Java', 'SQL', 'Bash']
	},
	{
		title: 'Machine learning',
		note: 'Deep learning, generative models, reinforcement learning.',
		items: [
			'PyTorch',
			'PyTorch Lightning',
			'TorchRL',
			'torchdiffeq',
			'TensorFlow / Keras',
			'scikit-learn',
			'Optuna',
			'LightGBM / XGBoost',
			'Gymnasium'
		]
	},
	{
		title: 'Mathematics',
		note: 'The part that decides whether the code is right.',
		items: [
			'Optimal transport',
			'Stochastic processes',
			'Survival analysis',
			'Convex optimisation',
			'Variational inference',
			'Measure & probability',
			'Linear & abstract algebra',
			'Information theory'
		]
	},
	{
		title: 'LLM systems',
		note: 'Retrieval, agents, and keeping them grounded.',
		items: [
			'OpenAI',
			'AWS Bedrock',
			'LangChain',
			'Sentence-Transformers',
			'Weaviate',
			'RAG',
			'Multi-tool agents',
			'Prompt templating'
		]
	},
	{
		title: 'Backend & data',
		note: 'What the models run inside.',
		items: [
			'FastAPI',
			'Django',
			'Spring Boot',
			'Redis / RQ',
			'Kafka',
			'PostgreSQL',
			'MongoDB',
			'MySQL / MariaDB',
			'SQL Server',
			'Oracle'
		]
	},
	{
		title: 'Front end',
		note: 'Enough to ship the whole thing.',
		items: ['Svelte / SvelteKit', 'Next.js / React', 'React Native', 'TypeScript', 'Tailwind']
	},
	{
		title: 'Infrastructure',
		note: 'Build it, run it.',
		items: [
			'Docker',
			'Kubernetes (AKS)',
			'Terraform',
			'Ansible',
			'Azure',
			'AWS',
			'SLURM / HPC',
			'GitHub Actions',
			'CMake',
			'uv'
		]
	},
	{
		title: 'Native & systems',
		note: 'When Python is not enough.',
		items: ['Boost', 'PyBind11', 'Qt', 'gRPC', 'Google Test', 'Boost.Test', 'OpenMP / threading']
	}
];

export const languages = [
	{ name: 'Arabic', level: 'Native' },
	{ name: 'English', level: 'Fluent — 875 TOEIC' },
	{ name: 'French', level: 'Fluent' }
];
