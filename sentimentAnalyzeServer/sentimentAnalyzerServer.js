const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = new express();
app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

function getNLUInstance()
{
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
                                    version: '2020-08-01',
                                    authenticator: new IamAuthenticator({
                                        apikey: api_key,
                                    }),
                                    serviceUrl: api_url
                                    });

        return naturalLanguageUnderstanding;
}

function emotion(text,res) {
    let NLUInstance = getNLUInstance();

     const analyzeParams = {
                'text': text,
               'features': {
    'entities': {
      'emotion': true,
      'sentiment': true,
      'limit': 1,
    },
    'keywords': {
      'emotion': true,
      'sentiment': true,
      'limit': 1,
    },
  },
};

                
           
         NLUInstance.analyze(analyzeParams)
                .then(analysisResults =>{
                   // res.send(JSON.stringify(analysisResults, null, 2));
                    //console.log((analysisResults.result.keywords[0].emotion.sadness));
                    res.send({"sadness" : analysisResults.result.keywords[0].emotion.sadness,
                               "joy" : analysisResults.result.keywords[0].emotion.joy,
                               "fear" : analysisResults.result.keywords[0].emotion.fear,
                               "disgust" : analysisResults.result.keywords[0].emotion.disgust,
                               "anger" : analysisResults.result.keywords[0].emotion.anger})
                }).catch(err => {
                   res.send(err.toString());
                }) 
          
}

function urlEmotion(text,res) {
    let NLUInstance = getNLUInstance();

     const analyzeParams = {
                'url': text,
               'features': {
    'entities': {
      'emotion': true,
      'sentiment': true,
      'limit': 1,
    },
    'keywords': {
      'emotion': true,
      'sentiment': true,
      'limit': 1,
    },
  },
};

                
           
         NLUInstance.analyze(analyzeParams)
                .then(analysisResults =>{
                   // res.send(JSON.stringify(analysisResults, null, 2));
                    //console.log((analysisResults.result.keywords[0].emotion.sadness));
                    res.send({"sadness" : analysisResults.result.keywords[0].emotion.sadness,
                               "joy" : analysisResults.result.keywords[0].emotion.joy,
                               "fear" : analysisResults.result.keywords[0].emotion.fear,
                               "disgust" : analysisResults.result.keywords[0].emotion.disgust,
                               "anger" : analysisResults.result.keywords[0].emotion.anger})
                }).catch(err => {
                   res.send(err.toString());
                }) 
          
}

function sentiment(text,res) {
    let NLUInstance = getNLUInstance();

     const analyzeParams = {
                'text': text,
               'features': {
    'entities': {
      'sentiment': true,
      'limit': 1,
    },
    'keywords': {
      'sentiment': true,
      'limit': 1,
    },
  },
};

                
           
         NLUInstance.analyze(analyzeParams)
                .then(analysisResults =>{

                res.send(analysisResults.result.keywords[0].sentiment.label);

                 
                }).catch(err => {
                   res.send(err.toString());
                }) 
   
}

function urlSentiment(text,res) {
    let NLUInstance = getNLUInstance();

     const analyzeParams = {
                'url': text,
               'features': {
                'entities': {
                'sentiment': true,
                'limit': 1,
                },
                'keywords': {
                'sentiment': true,
                'limit': 1,
                },
            },
            };
                        
                    
         NLUInstance.analyze(analyzeParams)
                .then(analysisResults =>{

                  //   console.log((analysisResults.result.keywords[0].sentiment.label));
               
                  res.send(analysisResults.result.keywords[0].sentiment.label);
                 
                }).catch(err => {
                   res.send(err.toString());
                }) 
   
}


app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {

    urlEmotion(req.query.url, res);
   
});

app.get("/url/sentiment", (req,res) => {
  //  return res.send("url sentiment for "+req.query.url);
   urlSentiment(req.query.url,res);
});

app.get("/text/emotion", (req,res) => {
     emotion(req.query.text,res);
});

app.get("/text/sentiment", (req,res) => {
   // return res.send("text sentiment for "+req.query.text);
   sentiment(req.query.text,res);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

