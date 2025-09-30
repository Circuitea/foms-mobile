import { Status, User } from "@/types";
import { ActionDispatch, createContext, PropsWithChildren, useContext, useReducer } from "react";

export const ProfileContext = createContext<User | null>(null);
export const ProfileDispatchContext = createContext<ActionDispatch<[action: Action]> | null>(null);

export function ProfileProvider({ children }: PropsWithChildren) {
  const [profile, dispatch] = useReducer(profileReducer, null);

  return (
    <ProfileContext value={profile}>
      <ProfileDispatchContext value={dispatch}>
        {children}
      </ProfileDispatchContext>
    </ProfileContext>
  )
}

export function useProfile() {
  const profile = useContext(ProfileContext);

  if (!profile) {
    throw new Error('useProfile should be used inside a ProfileProvider');
  }

  return profile;
}

export function useProfileDispatch() {
  const dispatch = useContext(ProfileDispatchContext);

  if (!dispatch) {
    throw new Error('useProfileDispatch should be used inside a ProfileProvider');
  }

  return dispatch;
}

function profileReducer(profile: User | null, action: Action) {
  switch(action.type) {
    case 'set':
      return action.user;

    case 'updateStatus':
      return {
        ...profile,
        status: action.status,
      };
    
    case 'remove':
      return null;
  }
}

type Action = SetProfileAction | RemoveProfileAction | UpdateStatusAction;

interface SetProfileAction {
  type: 'set';
  user: User;
}

interface UpdateStatusAction {
  type: 'updateStatus';
  status: Status;
}

interface RemoveProfileAction {
  type: 'remove';
}