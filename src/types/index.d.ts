export interface User {
  id: number;

  email: string;
  mobile_number;

  first_name: string;
  middle_name?: string;
  surname: string;
  name_extension?: string;

  position?: string;
  profile_picture_filename?: string;
  status: Status;
}

export type Status = 'available' | 'on break' | 'unavailable' | 'emergency';