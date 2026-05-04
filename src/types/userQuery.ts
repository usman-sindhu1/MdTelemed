export interface SubmitUserQueryBody {
  name: string;
  email: string;
  contact: string;
  reason: string;
  message: string;
}

export interface UserQueryRecord extends SubmitUserQueryBody {
  id: string;
  status: string;
  createdAt: string;
}
