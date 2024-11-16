const UserInfo = ({ user }) => {
  // Format the date of birth
  const formattedDOB = new Date(user.dateOfBirth).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get today's date
  const today = new Date();
  const userDOB = new Date(user.dateOfBirth);

  // Check if today is the user's birthday
  const isBirthday =
    today.getMonth() === userDOB.getMonth() &&
    today.getDate() === userDOB.getDate();

  // Make user.gender lowercase for consistent comparison
  const gender = user.gender.toLowerCase();

  return (
    <div className="bg-white shadow-md rounded-lg p-6 pr-32 mx-auto mb-6 max-w-sm relative">
      <h2 className="text-lg font-semibold">Student Information</h2>
      {/* <p className="mt-5">ID: {user.id}</p> */}
      <p className="mb-2 mt-4">Username: {user.login}</p>
      <p className="mb-2">
        Name: {user.firstName} {user.lastName}
      </p>
      <p className="mb-2">Email: {user.email}</p>
      {/* <p className="mb-2">Campus: {user.campus}</p> */}
      {/* <p className="mb-2">Gender: {user.gender}</p> */}

      {/* Conditional rendering for gender-specific images */}
      {gender === "female" && (
        <img
          src="./female.svg"
          alt="Female"
          className="absolute top-4 right-8 w-14 h-14"
        />
      )}
      {gender === "male" && (
        <img
          src="./male.svg"
          alt="Male"
          className="absolute top-4 right-8 w-14 h-14"
        />
      )}

      <p className="mb-2">Date Of Birth: {formattedDOB}</p>
      {/* <p>job: {user.job}</p>
       <p>employment: {user.employment}</p> */}

      {isBirthday && (
        <p className="mt-4 text-green-500 font-semibold">
          🎉 Happy Birthday, {user.firstName}! 🎂 Wishing you a wonderful year
          ahead! 🎉
        </p>
      )}

      {user.job === "UOB" && (
        <p className="mt-4 text-yellow-500 font-semibold">
          UOB Student! <br></br>
          YOU ARE A HERO 👑
        </p>
      )}

      {user.employment === "Student" && user.job !== "UOB" && (
        <p className="mt-4 text-blue-500 font-semibold">
          Keep rocking it, Uni student! 📚 You're doing awesome!
        </p>
      )}
    </div>
  );
};

export default UserInfo;
