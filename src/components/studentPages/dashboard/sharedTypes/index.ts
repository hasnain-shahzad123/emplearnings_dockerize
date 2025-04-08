interface Event {
	title: string;
	time: string;
	link: string;
}

export interface CalendarProps {
	events: {
		[key: number]: Event[];
	};
}
export interface Notifications {
	id: number;
	message: string;
	time: string;
}
export interface NotificationSectionProps {
	tutorNotifications: Notifications[];
}
