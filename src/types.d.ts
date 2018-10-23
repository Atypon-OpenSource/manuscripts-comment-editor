interface Model {
  _id: string
  objectType: string
}

export interface Keyword extends Model {
  name: string
}

export interface BibliographicName {
  family?: string
  given?: string
}

export interface UserProfile extends Model {
  bibliographicName: BibliographicName
}
