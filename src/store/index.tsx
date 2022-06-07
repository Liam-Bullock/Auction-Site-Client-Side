import create from 'zustand';
interface UserState {
    user: loggedUser;
    setUser: (user: loggedUser) => void;
    removeUser: () => void;
}

const getLocalStorage = (key: string): loggedUser => JSON.parse(window.localStorage.getItem(key) as string);
const setLocalStorage = (key: string, value:loggedUser) => window.localStorage.setItem(key, JSON.stringify(value));
const clearLocalStorage = () => window.localStorage.removeItem('user');

const useStore = create<UserState>(set=> ({
    user: getLocalStorage('user'),
    setUser: (user: loggedUser) => set((state) => {
        setLocalStorage('user', user)}),
    removeUser: () => set((state) => {
        clearLocalStorage()
    })
}))
export const useUserStore = useStore;