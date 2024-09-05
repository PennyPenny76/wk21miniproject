import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { CREATE_VOTE } from '../utils/mutations';
import { QUERY_MATCHUPS } from '../utils/queries';

const Vote = () => {

  const { matchupId } = useParams();
  console.log('matchupId', matchupId);

  const { loading, data, error, refetch } = useQuery(QUERY_MATCHUPS)
  console.log('loading', loading);
  console.log('data', data);
  console.log('error', error);

  const matchups = data?.matchups || [];
  console.log('matchups', matchups);

  const matchup = data?.matchups.find(matchup => matchup._id === matchupId) || {};
  console.log('matchup',matchup)

  const [createVote] = useMutation(CREATE_VOTE, {
    refetchQueries: [{ query: QUERY_MATCHUPS }],
  });
    
  const handleVote = async (techNum) => {
    console.log('Voting for tech number:', techNum); 
    console.log('Matchup ID:', matchupId);

    try {
      await createVote({
        variables: { matchupId, techNum: techNum },
      });
      refetch(); 
      console.log('Vote successfully created'); 
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card bg-white card-rounded w-50">
      <div className="card-header bg-dark text-center">
        <h1>Here is the matchup!</h1>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="card-body text-center mt-3">
          <h2>
            {matchup.tech1} vs. {matchup.tech2}
          </h2>
          <h3>
            {matchup.tech1_votes} : {matchup.tech2_votes}
          </h3>
          <button className="btn btn-info" onClick={() => handleVote(1)}>
            Vote for {matchup.tech1}
          </button>{' '}
          <button className="btn btn-info" onClick={() => handleVote(2)}>
            Vote for {matchup.tech2}
          </button>
          <div className="card-footer text-center m-3">
            <br></br>
            <Link to="/">
              <button className="btn btn-lg btn-danger">View all matchups</button>
            </Link>
          </div>
        </div>
      )}{error && <div>Something went wrong...</div>}
    </div>
  );
};

export default Vote;
