import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import WordCloud from './components/WordCloud/WordCloud';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

// Particles
import ParticlesWrapper from './components/ParticlesWrapper/ParticlesWrapper';

const initialState = {
    input: '',
    imageUrl: '',
    wordCloudUrl: '',
    route: 'signin', // Initially should go to the signin page
    isSignedIn: false,
    user: {
        id:'',
        name:'',
        email:'',
        entries:0,
        created: ''
    }
}


class App extends Component {

    constructor() {
        super();
        this.state = initialState;
    }

    loadUser = (data) => {
        this.setState({ 
            user: {
                id: data.id,
                name:data.name,
                email:data.email,
                entries:data.entries,
                created: data.created
            }
        });
    }

    // Getting the value of the image link field
    onInputChange = (event) => {
        // console.log(event.target.value);
        this.setState({
            input: event.target.value
        });
    }

    createWordCloudString = (predictions) => {
        // Accepts an array of objects
        // console.log(predictions);
        let wordCloudString = '';
        predictions.forEach(prediction => {
            wordCloudString = wordCloudString + (prediction.name.replace('-',' ') + ' ').repeat(prediction.value*200000)
        });
        // console.log(wordCloudString);
        this.setState({wordCloudUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif?20151024034921'})
        return wordCloudString;
    }

    makeWordCloud = (wordCloudString) => {
        fetch("https://quickchart.io/wordcloud", {
            method: "POST",
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({
                "format": "svg",
                "width": 300,
                "height": 300,
                "fontFamily": "sans-serif",
                "fontScale": 6,
                "padding": 2,
                "rotation": 5,
                // "useWordList": true,
                "scale": "linear",
                "text": wordCloudString
                }
            )
        })
         .then(res => res.blob()) // Converting the response to a Blob object
         .then(blob => {
            // Create a URL for the Blob
            const wordCloudUrl = URL.createObjectURL(blob);
            this.setState({ wordCloudUrl: wordCloudUrl })
        })
        .catch(err => console.log("Error:", err));
    }


    onButtonSubmit = () => {

        this.setState({
            imageUrl: this.state.input,
        }); // imageUrl set to the current input in the field

        
        fetch('http://localhost:3000/clarifai',{
            method:'post',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
                input:this.state.input
            })
        }).then(response => response.json())
            .then(result => this.makeWordCloud(this.createWordCloudString(result.outputs[0].data.concepts)))
            .then(done => {
                fetch('http://localhost:3000/image',{
                        method:'put',
                        headers:{'Content-Type':'application/json'},
                        body: JSON.stringify({
                            id:this.state.user.id
                        })
                    })
                        .then(data=>data.json())
                        .then(entries=>this.setState(Object.assign(this.state.user,{entries:entries}))) // Changing a property of an object without re/over-writing the whole object.
                        .catch(err=>console.log);
            })
            .catch(error => console.log('API Error', error));
    }

    // To go from signin -> app or app -> signin
    onRouteChange = (route) => {
        if (route==='signout') {
            this.setState(initialState);
        } else if (route==='home'){
            this.setState({isSignedIn:true});
        }

        this.setState({ route: route});
    }

    render() {
        const { isSignedIn, route } = this.state;
        return (
            <div className="App">
                {/* Had to use a wrapper since we can't init the particles engine (a "hook") in a class component*/}
                <ParticlesWrapper className='particles' />
                <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
                { route === 'home'
                ? <div>
                    <Logo />
                    <Rank user={this.state.user}/>
                    <ImageLinkForm changeFunction={this.onInputChange} submitFunction={this.onButtonSubmit}/>
                    <WordCloud imageUrl={this.state.imageUrl} wordCloudUrl={this.state.wordCloudUrl}/>
                  </div>
                : (
                    this.state.route === 'signin'
                    ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
                    : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
                )
                }
            </div>
        );
    }
}

export default App;
