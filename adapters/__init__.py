from abc import ABC, abstractmethod

class ServiceAdapter(ABC):
    @abstractmethod
    def search_tracks(self, keyword: str):
        pass

class ServiceTrackResponse(ABC):
    @abstractmethod
    def title(self) -> str:
        pass

    @abstractmethod
    def author(self) -> str:
        pass

    @abstractmethod
    def thumbnail_url(self) -> str:
        pass

    @abstractmethod
    def url(self) -> str:
        pass
