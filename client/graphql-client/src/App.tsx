import { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import "./App.css";
const GET_USERS = gql`
  query GetUsers {
    getUsers {
      age
      name
      isMarried
      id
    }
  }
`;

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      age
      name
      isMarried
      id
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $age: Int!, $isMarried: Boolean!) {
    createUser(name: $name, age: $age, isMarried: $isMarried) {
      name
    }
  }
`;

function App() {
  const [formObj, setFormObj] = useState<{
    name: string;
    age: number;
    isMarried: boolean;
  }>({ name: "", age: 0, isMarried: false });
  const {
    data: getUsersData,
    error: getUsersError,
    loading: getUsersLoading,
  } = useQuery(GET_USERS);

  const {
    data: getUserByIdData,
    error: getUserByIdError,
    loading: getUserByIdLoading,
  } = useQuery(GET_USER_BY_ID, {
    variables: { id: "2" },
  });
  const [createUser] = useMutation(CREATE_USER);

  const handleCreateUser = async () => {
    createUser({
      variables: {
        name: formObj.name,
        age: Number(formObj.age),
        isMarried: formObj.isMarried,
      }
    })
  };

  if (getUsersLoading) return <p>Loading...</p>;

  if (getUsersError) return <p>Error: {getUsersError.message}</p>;

  return (
    <>
      <div>
        <input
          placeholder="Name..."
          value={formObj.name}
          onChange={(e) =>
            setFormObj((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          type="number"
          placeholder="Age..."
          value={formObj.age}
          onChange={(e) =>
            setFormObj((prev) => ({ ...prev, age: e.target.value as Number }))
          }
        />
        <button onClick={handleCreateUser}>Create User</button>
      </div>
      <h1>Users</h1>

      <div>
        {getUserByIdLoading ? (
          <p>Loading User...</p>
        ) : (
          <>
            <h1>Chose User:</h1>
            <p>{getUserByIdData.getUserById.name}</p>
            <p>{getUserByIdData.getUserById.age}</p>
          </>
        )}
      </div>
      <div>
        {(getUsersData as unknown).getUsers.map((user: unknown) => (
          <div>
            <p>Name: {user?.name}</p>
            <p>Age: {user?.age}</p>
            <p>Is Married: {user?.isMarried ? "Yes" : "No"}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
