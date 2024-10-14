import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chords = {
  E: [
    { fret: 0, name: "E" },
    { fret: 2, name: "F#" },
    { fret: 4, name: "G#" },
    { fret: 5, name: "A" },
    { fret: 7, name: "B" },
    { fret: 9, name: "C#" },
    { fret: 11, name: "D#" },
    { fret: 12, name: "E" },
    { fret: 14, name: "F#" },
  ],
  A: [
    { fret: 0, name: "A" },
    { fret: 2, name: "B" },
    { fret: 4, name: "C#" },
    { fret: 5, name: "D" },
    { fret: 7, name: "E" },
    { fret: 9, name: "F#" },
    { fret: 11, name: "G#" },
    { fret: 12, name: "A" },
    { fret: 14, name: "B" },
  ],
};

const fretboardNotes = [
  { fret: 0, E: "E", A: "A" },
  { fret: 1, E: "F", A: "A#" },
  { fret: 2, E: "F#", A: "B" },
  { fret: 3, E: "G", A: "C" },
  { fret: 4, E: "G#", A: "C#" },
  { fret: 5, E: "A", A: "D" },
  { fret: 6, E: "A#", A: "D#" },
  { fret: 7, E: "B", A: "E" },
  { fret: 8, E: "C", A: "F" },
  { fret: 9, E: "C#", A: "F#" },
  { fret: 10, E: "D", A: "G" },
  { fret: 11, E: "D#", A: "G#" },
  { fret: 12, E: "E", A: "A" },
  { fret: 13, E: "F", A: "A#" },
  { fret: 14, E: "F#", A: "B" },
  { fret: 15, E: "G", A: "C" },
];

const AdvancedBarChordGame = () => {
  const [gameMode, setGameMode] = useState("E");
  const [currentFret, setCurrentFret] = useState(0);
  const [currentChordType, setCurrentChordType] = useState("E");
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [averageTime, setAverageTime] = useState(0);
  const [timeData, setTimeData] = useState([]);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    nextChord();
  }, [gameMode]);

  const checkAnswer = () => {
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000; // Convert to seconds

    const correct =
      userAnswer.toUpperCase() ===
      chords[currentChordType]
        .find((chord) => chord.fret === currentFret)
        .name.toUpperCase();
    setIsCorrect(correct);
    setShowResult(true);
    setTotalAttempts((prevAttempts) => prevAttempts + 1);

    if (correct) {
      setScore((prevScore) => prevScore + 1);
    }

    updateTimeData(timeTaken);

    if (correct) {
      setTimeout(() => {
        nextChord();
        setShowResult(false);
      }, 1000);
    }
  };

  const updateTimeData = (timeTaken) => {
    setAverageTime((prevAvg) => {
      const newAvg =
        (prevAvg * totalAttempts + timeTaken) / (totalAttempts + 1);
      return parseFloat(newAvg.toFixed(2));
    });

    if ((totalAttempts + 1) % 5 === 0) {
      setTimeData((prevData) => [
        ...prevData,
        { round: Math.floor((totalAttempts + 1) / 5), avgTime: averageTime },
      ]);
    }
  };

  const nextChord = () => {
    const availableChords = gameMode === "Both" ? ["E", "A"] : [gameMode];
    const selectedChordType =
      availableChords[Math.floor(Math.random() * availableChords.length)];
    const availableFrets = chords[selectedChordType].map((chord) => chord.fret);
    let nextFret;
    do {
      nextFret =
        availableFrets[Math.floor(Math.random() * availableFrets.length)];
    } while (nextFret === currentFret);

    setCurrentChordType(selectedChordType);
    setCurrentFret(nextFret);
    setUserAnswer("");
    setShowResult(false);
    setStartTime(Date.now());
  };

  const resetGame = () => {
    setScore(0);
    setTotalAttempts(0);
    setAverageTime(0);
    setTimeData([]);
    nextChord();
  };

  const renderFretboard = () => {
    return (
      <div
        className="relative w-full h-40 bg-amber-100 border border-amber-300 mb-4"
        onMouseEnter={() => setShowNotes(true)}
        onMouseLeave={() => setShowNotes(false)}
      >
        {fretboardNotes.map((note, index) => (
          <React.Fragment key={index}>
            <div
              className="absolute top-0 bottom-0 w-px bg-amber-300"
              style={{ left: `${(index / 15) * 100}%` }}
            />
            {showNotes && (
              <div
                className="absolute bottom-0 text-xs text-center"
                style={{
                  left: `${(index / 15) * 100}%`,
                  transform: "translateX(-50%)",
                  zIndex: 10, // Add z-index to the text divs
                }}
              >
                <div
                  style={{
                    fontWeight: note.A.length === 1 ? "bold" : "normal",
                  }}
                >
                  {note.A}
                </div>
                <div
                  style={{
                    fontWeight: note.E.length === 1 ? "bold" : "normal",
                  }}
                >
                  {note.E}
                </div>
              </div>
            )}
            {(index === 3 || index === 5 || index === 7 || index === 9) && (
              <div
                className="absolute bottom-0 w-4 h-4 bg-gray-300 rounded-full transform -translate-x-1/2"
                style={{ left: `${(index / 15) * 100}%` }}
              />
            )}
            {index === 12 && (
              <div
                className="absolute bottom-0 w-4 h-8 bg-transparent transform -translate-x-1/2"
                style={{ left: `${(index / 15) * 100}%` }}
              >
                <div className="w-4 h-4 bg-gray-300 rounded-full mb-1" />
                <div className="w-4 h-4 bg-gray-300 rounded-full" />
              </div>
            )}
          </React.Fragment>
        ))}
        <div className="absolute top-full left-0 text-xs">0</div>
        <div className="absolute top-full right-0 text-xs">15</div>
        <div
          className="absolute top-0 bottom-0 w-1 bg-red-500 transform -translate-x-1/2"
          style={{ left: `${(currentFret / 15) * 100}%` }}
        />
      </div>
    );
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">
        Bar Chord Teacher 🎸
      </h1>
      <div className="mb-4 text-xs text-center">
        <p>
          A quick app to help you learn the E and A Major Bar Chords, using
          Claude Artifacts and deployed with Replit in about 20 mins.
        </p>
      </div>
      <div className="mb-4">
        <Select value={gameMode} onValueChange={setGameMode}>
          <SelectTrigger>
            <SelectValue placeholder="Select game mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="E">E Major</SelectItem>
            <SelectItem value="A">A Major</SelectItem>
            <SelectItem value="Both">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {renderFretboard()}
      <div className="text-xs text-center mb-4">(hover to peek)</div>
      <div className="mb-4">
        <p>
          What is the name of the {currentChordType} major bar chord at fret{" "}
          {currentFret}?
        </p>
        <div className="flex mt-2">
          <Input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
            placeholder="Enter chord name"
            className="mr-2"
          />
          <Button onClick={checkAnswer}>Check</Button>
        </div>
      </div>
      <div className="mb-4">
        <p>
          Score: {score} / {totalAttempts}
        </p>
        <p>Average Time: {averageTime.toFixed(2)} seconds</p>
      </div>
      <Button onClick={resetGame} className="w-full mb-4">
        Reset Game
      </Button>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="round" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="avgTime" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-center mb-4">
        <a
          href="https://github.com/btjones-me/bar-chord-teacher"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get in touch <br></br>github.com/btjones-me/bar-chord-teacher
        </a>
      </p>
      <AlertDialog open={showResult}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isCorrect ? "Correct!" : "Incorrect"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isCorrect
                ? `Well done! ${chords[currentChordType].find((chord) => chord.fret === currentFret).name} is correct.`
                : `The correct answer is ${chords[currentChordType].find((chord) => chord.fret === currentFret).name}. Keep practicing!`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowResult(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdvancedBarChordGame;
