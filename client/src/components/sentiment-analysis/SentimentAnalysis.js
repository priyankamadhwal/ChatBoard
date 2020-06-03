import React from "react";
import { Doughnut } from "react-chartjs-2";

import "./SentimentAnalysis.css";

const SentimentAnalysis = (props) => {
  const [sentiment, setSentiment] = React.useState(null);

  React.useEffect(() => {
    setSentiment(props.sentiment);
  }, [props.sentiment]);

  return (
    <div className='sentimentAnalysisOuterContainer'>
      <span className='sentimentAnalysisHeading'>Sentiment Analysis</span>
      {sentiment
        ? sentiment.totalMessages + " " + sentiment.totalSentimentScore
        : ""}
      {sentiment ? (
        <Doughnut
          data={{
            labels: ["Positive", "Neutral", "Negative"],
            datasets: [
              {
                data: [
                  sentiment.positive,
                  sentiment.neutral,
                  sentiment.negative,
                ],
                backgroundColor: ["#2ff732", "#f7fa43", "#ff3b21"],
              },
            ],
          }}
          height={250}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default SentimentAnalysis;
