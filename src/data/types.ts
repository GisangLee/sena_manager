export type Member = {
    id: string;
    name: string;
    role: string;
  };
  
  export type ParticipationMap = {
    [date: string]: {
      [memberId: string]: boolean;
    };
  };