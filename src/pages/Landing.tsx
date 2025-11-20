import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { useAuthStore } from '@/store/authStore';

export default function Landing() {
  const { isAuthenticated } = useAuthStore();

  const pricingPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 49,
      duration: 'month',
      features: ['Access to all classes', 'Basic equipment', 'Mobile app access'],
      popular: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 89,
      duration: 'month',
      features: [
        'Unlimited classes',
        'Premium equipment',
        'Personal trainer sessions',
        'Nutrition guidance',
        'Priority booking',
      ],
      popular: true,
    },
    {
      id: 'elite',
      name: 'Elite',
      price: 149,
      duration: 'month',
      features: [
        'Everything in Premium',
        '24/7 access',
        'Locker & towel service',
        'Guest passes',
        'Spa access',
      ],
      popular: false,
    },
  ];

  const classTypes = [
    {
      name: 'Yoga',
      color: 'bg-gradient-to-br from-primary-100/20 to-primary-200/20',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80',
    },
    {
      name: 'Boxing',
      color: 'bg-gradient-to-br from-secondary-500/20 to-secondary-400/20',
      image: 'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?auto=format&fit=crop&w=500&q=80',
    },
    {
      name: 'Dance',
      color: 'bg-gradient-to-br from-pink-100/20 to-pink-200/20',
      image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=500&q=80',
    },
    {
      name: 'HIIT',
      color: 'bg-gradient-to-br from-orange-100/20 to-orange-200/20',
      image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=500&q=80',
    },
  ];

  const trainers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      specialty: 'Yoga & Pilates',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: '2',
      name: 'Mike Chen',
      specialty: 'Boxing & Strength',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: '3',
      name: 'Emma Davis',
      specialty: 'Dance & Cardio',
      image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: '4',
      name: 'Alex Rivera',
      specialty: 'HIIT & CrossFit',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-900 shadow-xl bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-black bg-gradient-to-r from-primary-400 via-primary-300 to-secondary-400 bg-clip-text text-transparent tracking-tight">
                GymVerse
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/signin">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-32 lg:px-8 bg-black">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-secondary-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="inline-block mb-6"
                >
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-300 text-sm font-bold shadow-lg shadow-primary-500/20">
                    Transform your body, transform your life
                  </span>
                </motion.div>
            <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-8xl mb-6 drop-shadow-2xl leading-tight">
              <span className="block">Your Fitness</span>
              <span className="block bg-gradient-to-r from-secondary-400 via-secondary-300 to-primary-400 bg-clip-text text-transparent">
                Journey Starts Here
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300 sm:text-xl max-w-2xl mx-auto">
              Join thousands of members achieving their goals with our modern facilities,
              expert trainers, and flexible class schedules.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {!isAuthenticated && (
                <>
                  <Link to="/signup">
                    <Button size="lg" variant="accent" className="text-lg px-8 py-4 shadow-2xl">
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link to="/classes">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-4 text-white border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm">
                      Browse Classes
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent"></div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 sm:py-24 bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-white sm:text-5xl mb-4 tracking-tight">
              Choose Your <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">Plan</span>
            </h2>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Flexible membership options to fit your lifestyle
            </p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  hover
                  className={`relative overflow-hidden ${plan.popular ? 'ring-4 ring-secondary-500/50 scale-105 border-secondary-500/30 shadow-2xl shadow-secondary-500/20' : 'border-gray-900'}`}
                >
                      {plan.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                          <span className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-black px-6 py-2 rounded-full text-sm font-black shadow-lg shadow-secondary-500/50">
                            Most Popular
                          </span>
                        </div>
                      )}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${plan.popular ? 'from-primary-500/10 to-secondary-500/10' : 'from-primary-500/5 to-transparent'} rounded-full -mr-16 -mt-16 blur-2xl`}></div>
                  <div className="text-center relative z-10">
                    <h3 className="text-2xl font-extrabold text-white mb-2">{plan.name}</h3>
                    <div className="mt-4">
                      <span className="text-5xl font-extrabold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">${plan.price}</span>
                      <span className="text-gray-400 ml-2">/{plan.duration}</span>
                    </div>
                    <ul className="mt-8 space-y-4 text-left">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <svg
                            className={`h-5 w-5 ${plan.popular ? 'text-accent' : 'text-primary-500'} mr-2 mt-0.5 flex-shrink-0`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      {isAuthenticated ? (
                        <Link to="/dashboard">
                          <Button variant={plan.popular ? 'primary' : 'outline'} fullWidth>
                            Current Plan
                          </Button>
                        </Link>
                      ) : (
                        <Link to="/signup">
                          <Button variant={plan.popular ? 'primary' : 'outline'} fullWidth>
                            Get Started
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Classes Preview */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-white sm:text-5xl mb-4 tracking-tight">
              Explore Our <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">Classes</span>
            </h2>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              From high-intensity workouts to mindful yoga sessions
            </p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {classTypes.map((classType, index) => (
              <motion.div
                key={classType.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card hover className="text-center group">
                    <ImageWithFallback
                      src={classType.image}
                      alt={classType.name}
                      wrapperClassName={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${classType.color} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300 overflow-hidden`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  <h3 className="text-xl font-semibold text-white">{classType.name}</h3>
                  <p className="mt-2 text-sm text-gray-300">
                    Expert-led sessions designed to push your limits
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trainers Carousel */}
      <section className="py-20 sm:py-24 bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-white sm:text-5xl mb-4 tracking-tight">
              Meet Our <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">Trainers</span>
            </h2>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Certified professionals dedicated to your success
            </p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trainers.map((trainer, index) => (
              <motion.div
                key={trainer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card hover className="text-center group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <ImageWithFallback
                    src={trainer.image}
                    alt={trainer.name}
                    wrapperClassName="mb-4 relative z-10 group-hover:scale-105 transition-transform duration-300 w-24 h-24 mx-auto rounded-full border-4 border-white/20 shadow-xl"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <h3 className="text-xl font-black text-white relative z-10">{trainer.name}</h3>
                  <p className="mt-2 text-sm font-bold text-primary-400 relative z-10">{trainer.specialty}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Highlight */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="card-gradient relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-white">Visit Our Store</h2>
                <p className="text-white/90 text-lg">
                  Premium supplements, apparel, and equipment to support your fitness journey
                </p>
              </div>
              {isAuthenticated ? (
                <Link to="/store">
                  <Button variant="accent" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                    Shop Now
                  </Button>
                </Link>
              ) : (
                <Link to="/signup">
                  <Button variant="accent" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                    Sign Up to Shop
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 text-white py-12 relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h3 className="text-2xl font-black mb-4 bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent tracking-tight">GymVerse</h3>
            <p className="text-gray-300">Your fitness journey starts here</p>
            <p className="mt-4 text-sm text-gray-400">
              © {new Date().getFullYear()} GymVerse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

