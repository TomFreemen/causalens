"""
Copyright 2023 Impulse Innovations Limited


Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""

from typing import Callable, Coroutine, Dict

from dara.core.internal.registry import Registry


class RegistryLookup:
    """
    Manages registry Lookup.
    """

    def __init__(self, handlers: Dict[str,Callable[[str],Coroutine]]={}):
        self.handlers = handlers

    async def get(self, registry: Registry, uid: str):
        """
        Get the entry from registry by uid.
        If uid is not in registry and it has a external handler that defined, will execute the handler

        :param registry: target registry
        :param uid: entry id
        """
        try:
            return registry.get(uid)
        except KeyError as e:
            if registry.name in self.handlers:
                func = self.handlers[registry.name]
                entry = await func(uid)
                registry.register(uid, entry)
                return entry
            raise ValueError(
                f'Could not find uid {uid} in {registry.name} registry, did you register it before the app was initialized?'
            ).with_traceback(e.__traceback__)
