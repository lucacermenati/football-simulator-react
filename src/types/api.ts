// Requests
export type RegistrationRequest = {
	name: string;
	email: string;
	password: string;
	password_confirmation: string;
};

export type LoginCredentials = {
	email: string;
	password: string;
};

export type CreateCompetitionRequest = {
	name: string;
	description: string;
	logo: FileList | null;
};

export type UpdateCompetitionRequest = {
	name: string;
	description?: string;
};

export type UpdateTeamRequest = {
	name: string;
	rating?: number;
	history?: string;
	first_color?: string;
	second_color?: string;
	year_of_foundation?: number;
	stadium?: string;
};

export type CreateTeamRequest = {
	name: string;
	rating?: number;
	history?: string;
	first_color?: string;
	second_color?: string;
	year_of_foundation?: number;
	stadium?: string;
	logo?: FileList | null;
};

export type CreatePlayerRequest = {
	first_name?: string | null;
	last_name?: string | null;
	birth_date?: string | null;
	position?: string | null;
	nationality?: string | null;
	number?: number | null;
};

export type UpdatePlayerRequest = {
	first_name: string;
	last_name: string;
	birth_date: string;
	position: string;
	nationality: string;
	number: number;
};

export type UpdateLogoRequest = {
	logo: FileList;
};

export type ManageCompetitionTeamsRequest = {
	teams: string[];
};

export type GenerateCompetitionMatchesRequest = {
	start_date: string;
};

export type UpdateProfileRequest = {
	name: string;
	email: string;
}

// Responses
export type NoContentResponse = object;

export type ApiErrorResponse = {
	message?: string;
	errors?: Record<string, string[]>;
};

// Resources
export type BearerTokenResource = {
	access_token: string;
	token_type: string;
};

export type User = {
	id: string;
	name: string;
	email: string;
};

export type Competition = {
	id: string;
	name: string;
	description: string;
	logo: string;
};

export type CompetitionPosition = {
	id: string;
	name: string;
	logo: string;
	position: number;
};

export type ReadyCompetition = {
	id: string;
	name: string;
	logo: string;
	next_match_date: string;
};

export type Team = {
	id: string;
	name: string;
	history: string;
	logo: string;
	first_color: string;
	second_color: string;
	year_of_foundation: number;
	stadium: string;
	rating: number;
};

export type Player = {
	id: string;
	first_name: string;
	last_name: string;
	full_name: string;
	birth_date: string;
	position: string;
	position_on_field: number;
	number: number;
	rating: number;
	nationality: string;
	team_id: string;
	team?: Team;
};

export type Nationality = {
	code: string;
	name: string;
};

export type Match = {
	id: string;
	date: string;
	day: number;
	goal_home: number;
	goal_away: number;
	played: boolean;
	competition: null | Competition;
	home_team: null | Team;
	away_team: null | Team;
	scorers: null | MatchEvent[];
};

export type MatchEvent = {
	minute: number;
	player: Player;
};

export type Standings = Array<StandingTeam>;

export type StandingTeam = {
	id: string;
	name: string;
	logo?: string;
	first_color: string;
	second_color: string;
	points: number;
	matches: number;
	win: number;
	draw: number;
	loss: number;
	goals: number;
	goals_against: number;
	goal_difference: number;
};

export type Statistics = Array<PlayerStatistic>;

export type PlayerStatistic = {
	id: string;
	first_name: string;
	last_name: string;
	full_name: string;
	position: string;
	number: number;
	goals: number;
	team?: Team;
};

export type Link = {
	url: string | null;
	label: string;
	active: boolean;
};

export type PaginationLinks = {
	first: string;
	last: string;
	prev: string | null;
	next: string | null;
};

export type PaginationMeta = {
	current_page: number;
	from: number;
	last_page: number;
	per_page: number;
	to: number;
	total: number;
	path: string;
	links: Link[];
};

export type PaginatedData<T> = {
	data: T[];
	links: PaginationLinks;
	meta: PaginationMeta;
};
