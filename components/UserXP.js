// components/UserXP.js

const UserXP = ({ auditRatio, totalUp, totalDown }) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-6">
    <h2 className="text-lg font-semibold">User XP</h2>
    <p>Audit Ratio: {auditRatio}</p>
    <p>Total Upvotes: {totalUp}</p>
    <p>Total Downvotes: {totalDown}</p>
  </div>
);

export default UserXP;
