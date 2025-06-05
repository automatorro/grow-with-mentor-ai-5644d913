
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Users, TrendingUp, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const LandingPage: React.FC = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-professional-blue-50 to-growth-teal-50 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/80 rounded-full px-4 py-2 mb-6">
              <Brain className="h-4 w-4 text-growth-teal-500" />
              <span className="text-sm font-medium text-professional-grey-700">
                AI-Powered Professional Development
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-professional-grey-900 mb-6 animate-fade-in">
              Unlock Your 
              <span className="gradient-text"> Professional Potential</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-professional-grey-600 mb-8 max-w-2xl mx-auto">
              Get personalized AI-driven training in the soft skills that matter most for your career growth.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-growth text-lg px-8 py-4">
                <Link to="/signup">
                  Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4">
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-professional-grey-900 mb-6">
              Your Personalized Growth Journey
            </h2>
            <p className="text-lg text-professional-grey-600">
              Experience a guided, step-by-step journey designed to unlock your full professional potential.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-sky-100 rounded-xl p-6 shadow-sm border border-sky-200 hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-professional-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-professional-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-professional-grey-900">
                  AI-Powered Assessment
                </h3>
                <p className="text-professional-grey-600">
                  Take our comprehensive assessment to identify your unique strengths and growth areas.
                </p>
                <div className="mt-4 flex items-center text-sm text-growth-teal-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Free Access
                </div>
              </CardContent>
            </Card>

            <Card className="bg-sky-100 rounded-xl p-6 shadow-sm border border-sky-200 hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-growth-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-growth-teal-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-professional-grey-900">
                  Personalized Learning Path
                </h3>
                <p className="text-professional-grey-600">
                  Get a customized learning journey tailored to your specific needs and career goals.
                </p>
                <div className="mt-4 flex items-center text-sm text-professional-blue-600">
                  <Star className="h-4 w-4 mr-1" />
                  Premium Feature
                </div>
              </CardContent>
            </Card>

            <Card className="bg-sky-100 rounded-xl p-6 shadow-sm border border-sky-200 hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-professional-grey-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-professional-grey-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-professional-grey-900">
                  Practice & Feedback
                </h3>
                <p className="text-professional-grey-600">
                  Engage in interactive exercises and receive detailed feedback to accelerate your growth.
                </p>
                <div className="mt-4 flex items-center text-sm text-professional-blue-600">
                  <Star className="h-4 w-4 mr-1" />
                  Premium Feature
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-professional-grey-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-professional-grey-900 mb-6">
              Choose Your Plan
            </h2>
            <p className="text-lg text-professional-grey-600">
              Start your journey for free, then unlock advanced features with Premium.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-white rounded-xl p-6 shadow-sm border border-professional-grey-200 hover:shadow-md transition-all duration-200">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-professional-grey-900 mb-2">Free</h3>
                  <div className="text-4xl font-bold text-professional-grey-900 mb-2">$0</div>
                  <p className="text-professional-grey-600">Perfect to get started</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-growth-teal-500 mr-3" />
                    <span className="text-professional-grey-700">AI-Powered Assessment</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-growth-teal-500 mr-3" />
                    <span className="text-professional-grey-700">Basic Results & Insights</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-growth-teal-500 mr-3" />
                    <span className="text-professional-grey-700">Progress Tracking</span>
                  </li>
                </ul>
                
                <Button asChild className="w-full btn-professional">
                  <Link to="/signup">Get Started Free</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="bg-white rounded-xl p-6 shadow-sm border border-professional-grey-200 hover:shadow-md transition-all duration-200 ring-2 ring-growth-teal-500 ring-offset-2">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="inline-block bg-growth-teal-500 text-white text-sm font-medium px-3 py-1 rounded-full mb-2">
                    Most Popular
                  </div>
                  <h3 className="text-2xl font-bold text-professional-grey-900 mb-2">Premium</h3>
                  <div className="text-4xl font-bold text-professional-grey-900 mb-2">$29</div>
                  <p className="text-professional-grey-600">per month</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-growth-teal-500 mr-3" />
                    <span className="text-professional-grey-700">Everything in Free</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-growth-teal-500 mr-3" />
                    <span className="text-professional-grey-700">Personalized Learning Path</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-growth-teal-500 mr-3" />
                    <span className="text-professional-grey-700">Advanced Analytics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-growth-teal-500 mr-3" />
                    <span className="text-professional-grey-700">Interactive Exercises</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-growth-teal-500 mr-3" />
                    <span className="text-professional-grey-700">Priority Support</span>
                  </li>
                </ul>
                
                <Button asChild className="w-full btn-growth">
                  <Link to="/signup">Start Premium Trial</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-professional-blue-600 to-growth-teal-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already growing their careers with MentorAI.
          </p>
          <Button asChild size="lg" className="bg-white text-professional-blue-600 hover:bg-white/90 text-lg px-8 py-4">
            <Link to="/signup">
              Begin Your Journey <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
