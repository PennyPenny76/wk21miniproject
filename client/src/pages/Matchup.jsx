/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { QUERY_TECH, QUERY_MATCHUPS } from '../utils/queries';
import { CREATE_MATCHUP } from '../utils/mutations';

const Matchup = () => {
  const [formData, setFormData] = useState({
    tech1: 'JavaScript',
    tech2: 'JavaScript',
  });
  let navigate = useNavigate();

  const { loading, data } = useQuery(QUERY_TECH);
  const techList = data?.tech || [];
  console.log(techList);

  const [createMatchup, { error }] = useMutation(CREATE_MATCHUP,{
    refetchQueries: [{ query: QUERY_MATCHUPS }],
  });


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const { tech1, tech2 } = formData;

    try {
      const { data } = await createMatchup({
        variables: { tech1,tech2 },
      });
      navigate(`/matchup/${data.createMatchup._id}`);
      setFormData({
        tech1: 'JavaScript',
        tech2: 'JavaScript',
        
      });

    } catch (err) {
      console.error(err);
    }
    
  };

  return (
    <div className="card bg-white card-rounded w-25">
      <div className="card-header bg-dark text-center">
        <h1>Let's create a matchup!</h1>
      </div>
      <div className="card-body m-5">
      {loading ? (
            <div>Loading...</div>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <label>Tech 1: </label>
          <select 
            name="tech1" 
            value={formData.tech1}
            onChange={handleInputChange}>
              {techList.map((tech) => {
                return (
                  <option key={tech._id} value={tech.name}>
                    {tech.name}
                  </option>
                );
              })}
          </select>

          <label>Tech 2: </label>
          <select 
            name="tech2" 
            value={formData.tech2}
            onChange={handleInputChange}>
              {techList.map((tech) => {
                return (
                  <option key={tech._id} value={tech.name}>
                    {tech.name}
                  </option>
                );
              })}
          </select>
          <button className="btn btn-danger" type="submit">
            Create Matchup!
          </button>
        </form>
        )}
      </div>
      {error && <div>Something went wrong...</div>}
    </div>
  );
};

export default Matchup;
