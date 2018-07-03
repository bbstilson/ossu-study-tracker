// @flow

export type Course = {
  id: string,
  link: string,
  title: string,
  effort: string,
  position: number,
  duration: string,
  completed: boolean,
  completed_on?: Date,
  difficulty?: number
}
