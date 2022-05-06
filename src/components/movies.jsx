import React, { Component } from 'react';
import { getMovies } from '../services/fakeMovieService';
import ListGroup from './listGroup';
import Like from './common/like';
import Pagination from './pagination';
import { paginate } from '../utils/paginate';
import { genres, getGenres } from '../services/fakeGenreService';

class Movies extends Component {
    state = { 
        movies: getMovies(),
        genres: getGenres(),
        currentGenre: 'Thriller',
        currentPage: 1,
        pageSize: 4,
         
     } ;

     handleDelete = (movie) => {
         console.log(movie)
        const movies = this.state.movies.filter(m => m._id !== movie._id);
        this.setState({ movies });
     };

    handleLike = (movie) => {
        const movies = [...this.state.movies];
        const index = movies.indexOf(movie);
        movies[index] = { ...movies[index] };
        movies[index].liked = !movies[index].liked;
        this.setState({ movies });
    };

    handlePageChange = page => {
        this.setState({ currentPage: page });
        console.log(page)
    }
//filters movies based on their genre
    handleGenre = (genre, allMovies) => {
        const movies = allMovies.filter(m => m.genre !== genres.name);
        this.setState({ currentGenre: genre, movies: movies });
        console.log(genre)
    }

     render() {
        const { length: count } = this.state.movies;
        const { pageSize, currentPage, movies:allMovies } = this.state;

        if ( count === 0) 
        return <p>"There are no movies in the database." </p> 

        const movies = paginate(allMovies, currentPage, pageSize);

        return (
            <div className='row'>
                <div className="col-2">
                    <ul className="list-group">
                            { genres.map(genre => 
                                <li key={genre._id} className={ genre.name === this.state.currentGenre ? "list-group-item active" : "list-group-item"} onClick={() => this.handleGenre(genre.name, movies)} >{genre.name} </li>
                            )}
                    </ul>
                </div>
                <div className="col">
                    <p>Showing { count } movies in the database.</p>

                    <table className="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Genre</th>
                                <th>Stock</th>
                                <th>Rate</th>
                                <th/>
                                <th/>
                            </tr>
                        </thead>
                        <tbody>
                            {movies.map(movie => 
                            <tr key={movie._id}>
                                <td>{movie.title}</td>
                                <td>{movie.genre.name}</td>
                                <td>{movie.numberInStock}</td>
                                <td>{movie.dailyRentalRate}</td>
                                <td>
                                    <Like liked={movie.liked} onClick={() => this.handleLike(movie)} />
                                </td>
                                <td><button onClick={() => this.handleDelete(movie)} className='btn btn-danger btn-sm'>Delete</button></td>
                            </tr>)}
                        </tbody>
                    </table>
                    <Pagination 
                    itemsCount={count} 
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={this.handlePageChange} 
                    />   
                </div>

 
            </div>
        )}
}
 
export default Movies;