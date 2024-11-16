export const XP_PER_PROJECT = `
query Transaction {
  transaction(
    where: {
      eventId: { _eq: 20 },
      type: { _eq: "xp" },
      _and: [
        { path: { _nilike: "%checkpoint%" } }
      ]
    },
    order_by: { createdAt: desc }
  ) {
    amount
    createdAt
    path
  }
}

`;

export const USER_QUERY = `query {
  user {
    id
    login
    email
    campus
    lastName
    firstName
    gender: attrs(path: "genders")
    job: attrs(path: "jobtitle")
    employment: attrs(path: "employment")
    dateOfBirth: attrs(path: "dateOfBirth")
  }
}`;

export const GET_USER_WITH_AUDIT = `query {
    user {
      id
      auditRatio
      totalUp
      totalDown
    }
  }`;

export const GET_XP = `query totalXP($userId: Int!, $rootEventId: Int!) {
    xp: transaction_aggregate(
      where: {
        userId: { _eq: $userId }
        type: { _eq: "xp" }
        eventId: { _eq: $rootEventId }
      }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
  }`;

export const GET_MODULE_EVENT = `query user($userId: Int!, $modulePath: String!) {
    user(where: { id: { _eq: $userId } }) {
      events(where: { event: { path: { _eq: $modulePath } } }) {
        eventId
        level
        event {
          campus
          createdAt
          endAt
          id
          path
          registrations {
            id
          }
        }
      }
    }
  }`;

export const GET_PROJECTS_TRANSACTIONS = `query Transaction($userId: Int!, $eventId: Int!) {
    transaction(
      where: {
        type: { _eq: "xp" }
        eventId: { _eq: $eventId }
        originEventId: { _eq: $eventId }
        userId: { _eq: $userId }
      }
    ) {
      amount
      createdAt
      object {
        name
      }
    }
  }`;

export const GET_PROJECTS_DATA = `query Object($eventId: Int!, $registrationId: Int!) {
    object(
      where: {
        type: { _eq: "module" }
        events: { id: { _eq: $eventId } }
        registrations: { id: { _eq: $registrationId } }
      }
    ) {
      type
      name
      childrenRelation {
        attrs
        key
      }
    }
  }`;

export const GET_SKILLS = `query Transaction($userId: Int!) {
    transaction(
      limit: 6
      order_by: [{ type: desc }, { amount: desc }]
      distinct_on: [type]
      where: { userId: { _eq: $userId }, type: { _like: "skill_%" } }
    ) {
      type
      amount
    }
  }`;

// to get the prerequisites for the module
export const GET_MODULE_CHILDREN = `query Object($eventId: Int!, $registrationId: Int!) {
    object(
      where: {
        type: { _eq: "module" }
        events: { id: { _eq: $eventId } }
        registrations: { id: { _eq: $registrationId } }
      }
    ) {
      type
      name
      childrenRelation {
        attrs
        key
        paths {
          object {
            name
          }
        }
      }
    }
  }`;
