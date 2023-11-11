import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);

  const [allFriends, setFriend] = useState([...initialFriends]);

  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(friend) {
    setFriend((e) => {
      return [...e, friend];
    });

    setShowAddFriend(false);
  }

  function handleSplitBill(value){

    console.log(value)

    setFriend(e => {
      return e.map(friend => friend.id === selectedFriend.id ? {...friend,balance:friend.balance + value} : friend);
    })


  }

  function handleSelection({ friend }) {
    setShowAddFriend(false);
    setSelectedFriend((e) => (e?.id === friend?.id ? null : friend));
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friendList={allFriends}
          handleSelection={handleSelection}
          selectedFriend={selectedFriend}
        /> 
        {showAddFriend && <FormAddFriend onSetFriend={handleAddFriend} />}

        <Button onClick={() => setShowAddFriend((e) => !e)}>
          {showAddFriend ? "close" : "Add Friend"}
        </Button>
      </div>

      {selectedFriend && <FormSplitBill key={selectedFriend.id} friend={selectedFriend} onSplitBill={handleSplitBill}  />}
    </div>
  );
}

function FriendsList({ friendList, handleSelection, selectedFriend }) {
  console.log(selectedFriend);

  return (
    <ul>
      {friendList.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          handleSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, handleSelection, selectedFriend }) {
  const isSelected = friend?.id === selectedFriend?.id;
  console.log(isSelected);
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
           {friend.name} owes you {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && <p>You and your friend are even</p>}

      <Button
        onClick={() => {
          return handleSelection({ friend });
        }}
      >
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onSetFriend }) {
  const [name, onSetName] = useState("");
  const [url, onSetUrl] = useState("https://i.pravatar.cc/48");

  function handleAddFriend(e) {
    if (!name || !url) return;

    e.preventDefault();
    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${url}?=${id}`,
      id,
      balance: 0,
    };

    console.log(newFriend);

    onSetFriend(newFriend);

    onSetName("");
    onSetUrl("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleAddFriend}>
      <label>🧑‍🤝‍🧑Name</label>
      <input
        type="text"
        onChange={(e) => onSetName(e.target.value)}
        value={name}
      />

      <label>🖼️Image URL</label>
      <input
        type="text"
        onChange={(e) => onSetUrl(e.target.value)}
        value={url}
      />

      <Button>Add </Button>
    </form>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormSplitBill({ friend,onSplitBill }) {
  const [bill, setBill] = useState("");

  const [paidByUser, setPaidByUser] = useState("");

  const paidByFriend = bill ? bill - paidByUser : ""

  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e){
    e.preventDefault();

    if(!bill || !paidByUser) return ;

    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser );

    setBill("");
    setPaidByUser("") 
    setWhoIsPaying("user")
  }



  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {friend.name}</h2>
      <label>💰Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🤑Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) => setPaidByUser(Number(e.target.value) > bill ? paidByUser : e.target.value)}
      />

      <label>🧑‍🤝‍🧑{friend.name}'s Expense</label>
      <input type="text" disabled value={paidByFriend}/>

      <label>Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>

      <Button >Split Bill</Button>
    </form>
  );
}
