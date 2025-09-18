import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  SkipForward, 
  CheckCircle, 
  Recycle, 
  Leaf,
  Globe,
  Users
} from 'lucide-react';

interface AwarenessVideoProps {
  onComplete: () => void;
  onSkip: () => void;
}

const AwarenessVideo: React.FC<AwarenessVideoProps> = ({ onComplete, onSkip }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isWatching, setIsWatching] = useState(false);

  const slides = [
    {
      title: "Welcome to EcoWaste! 🌍",
      content: "Join thousands of eco-warriors in making our planet cleaner and greener. Together, we can create a sustainable future for generations to come.",
      icon: Globe,
      color: "text-eco-green"
    },
    {
      title: "Report Waste Issues 📸",
      content: "Use your phone to capture and report waste management problems in your community. Every report helps create a cleaner environment and earns you credits!",
      icon: Recycle,
      color: "text-eco-accent"
    },
    {
      title: "Connect with Workers 🤝",
      content: "Find local waste collectors and recycling workers. Compare prices for different materials and choose the best option for your needs.",
      icon: Users,
      color: "text-eco-warning"
    },
    {
      title: "Earn Green Credits 🏆",
      content: "Every action you take earns eco-credits! Report issues, provide feedback, and participate in community events to unlock amazing rewards.",
      icon: Leaf,
      color: "text-eco-success"
    }
  ];

  const progress = ((currentSlide + 1) / slides.length) * 100;

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const startWatching = () => {
    setIsWatching(true);
    // Simulate video watching
    setTimeout(() => {
      nextSlide();
    }, 2000);
  };

  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;

  return (
    <div className="min-h-screen flex items-center justify-center eco-gradient p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-white/20">
              <Recycle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to EcoWaste Training
          </h1>
          <p className="text-white/90">
            Learn how to make a positive environmental impact
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-white/80 mb-2">
            <span>Progress</span>
            <span>{currentSlide + 1} of {slides.length}</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/20" />
        </div>

        {/* Main Content Card */}
        <Card className="eco-shadow">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-6 rounded-full bg-eco-light">
                <Icon className={`h-16 w-16 ${currentSlideData.color}`} />
              </div>
            </div>
            <CardTitle className="text-2xl text-eco-dark">
              {currentSlideData.title}
            </CardTitle>
            <CardDescription className="text-lg mt-4">
              {currentSlideData.content}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Video Placeholder */}
            <div className="aspect-video bg-eco-light rounded-lg flex items-center justify-center border-2 border-dashed border-eco-green">
              {!isWatching ? (
                <Button
                  onClick={startWatching}
                  size="lg"
                  className="eco-gradient"
                >
                  <Play className="h-6 w-6 mr-2" />
                  Watch Training Video ({currentSlide + 1}/{slides.length})
                </Button>
              ) : (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green mx-auto mb-4"></div>
                  <p className="text-eco-dark">Loading video content...</p>
                </div>
              )}
            </div>

            {/* Key Points */}
            <div className="bg-eco-light p-4 rounded-lg">
              <h4 className="font-semibold text-eco-dark mb-3">Key Points:</h4>
              <div className="space-y-2">
                {currentSlide === 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-eco-green" />
                      <span>Join a community of environmental champions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-eco-green" />
                      <span>Make real impact through collective action</span>
                    </div>
                  </div>
                )}
                {currentSlide === 1 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-eco-green" />
                      <span>Take clear photos of waste issues</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-eco-green" />
                      <span>Provide detailed location information</span>
                    </div>
                  </div>
                )}
                {currentSlide === 2 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-eco-green" />
                      <span>Compare prices from different workers</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-eco-green" />
                      <span>Contact workers directly for scheduling</span>
                    </div>
                  </div>
                )}
                {currentSlide === 3 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-eco-green" />
                      <span>Earn credits for every positive action</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-eco-green" />
                      <span>Redeem rewards when you reach 100 credits</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onSkip}
                className="flex-1"
              >
                <SkipForward className="h-4 w-4 mr-2" />
                Skip Training
              </Button>
              
              <Button
                onClick={nextSlide}
                className="flex-1 eco-gradient"
                disabled={isWatching}
              >
                {currentSlide === slides.length - 1 ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Training
                  </>
                ) : (
                  'Next Slide'
                )}
              </Button>
            </div>

            {/* Note */}
            <p className="text-xs text-muted-foreground text-center">
              💡 You can always access this training later from your dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AwarenessVideo;